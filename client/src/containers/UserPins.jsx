import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiPinActions from "../store/actions/apiPinActions";

import ImageGrid from "../components/ImageGrid";
import { openSnackbar } from "./Notifier";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  message: {
    margin: "auto",
    width: "50%",
    textAlign: "center",
    height: "50%",
    lineHeight: "2em"
  },
  container: {
    width: "100%",
    height: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "40px 0"
  }
});

class UserPins extends Component {
  state = {
    deleteDialogOpen: false,
    selectedPin: {}
  };

  componentDidMount() {
    if (this.props.match.params && this.props.match.params.userId) {
      const { userId } = this.props.match.params;
      this.getUserPins(userId);
      return;
    }
    if (this.props.profile.profile._id) {
      this.getUserPins();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profile.profile._id !== this.props.profile.profile._id) {
      this.getUserPins();
    }
  }

  getUserPins = user => {
    let userId;
    if (!user) {
      userId = this.props.profile.profile._id;
    } else {
      userId = user;
    }
    const pin = JSON.parse(window.localStorage.getItem("pin"));
    if (pin) {
      // if user was redirected to login after trying to add a pin
      // retrieve that pin from localStorage, add it to the user's wall

      const token = this.props.appState.authToken;
      this.props.apiPin
        .addPin(token, pin)
        .then(result => {
          console.log(result);
          if (result.type === "ADD_PIN_SUCCESS") {
            openSnackbar("success", `Pin saved to your wall.`);
            this.props.apiPin
              .getUserPins(userId)
              .then(result => {
                console.log(this.props.pin.loggedInUserPins);
              })
              .catch(err => {
                console.log(err);
                openSnackbar("error", err);
              });
          } else {
            openSnackbar("error", this.props.pin.error);
          }
        })
        .catch(err => {
          console.log(err);
          openSnackbar("error", err);
        });
      // then remove stored pin from localStorage
      window.localStorage.removeItem("pin");
      return;
    }

    this.props.apiPin
      .getUserPins(userId)
      .then(result => {
        if (result.type === "GET_USER_PINS_SUCCESS") {
          this.props.apiProfile
            .getPartialProfile(userId)
            .then(result => {
              if (result.type !== "GET_PARTIAL_PROFILE_SUCCESS") {
                console.log(this.props.profile.error);
                openSnackbar("error", this.props.profile.error);
              }
            })
            .catch(err => {
              console.log(err);
              openSnackbar("error", err);
            });
        } else {
          console.log(this.props.profile.error);
          openSnackbar("error", this.props.profile.error);
        }
      })
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  };

  removePin = pinData => {
    console.log("removePin");
    console.log(pinData);
    this.setState({
      dialogOpen: true,
      selectedPin: { ...pinData }
    });
    const token = this.props.appState.authToken;
    const userId = this.props.profile.profile._id;
    this.props.apiPin
      .removePin(token, pinData._id)
      .then(result => {
        if (result.type === "REMOVE_PIN_SUCCESS") {
          openSnackbar("success", `Deleted pin from your wall.`);
          this.props.apiPin
            .getUserPins(userId)
            .then(result => console.log(this.props.pin.pins))
            .catch(err => {
              console.log(err);
              openSnackbar("error", err);
            });
        } else {
          openSnackbar("error", this.props.pin.error);
        }
      })
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
      });
  };

  handleDeleteDialogOpen = pin => {
    console.log("open delete dialog");
    if (pin) {
      console.log(pin);
      if (!this.props.appState.loggedIn) {
        openSnackbar("error", "Please log in to delete a pin");
        return;
      }
    }
    this.setState({ deleteDialogOpen: true, selectedPin: { ...pin } });
  };

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogOpen: false, selectedPin: {} });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.props.pin.loggedInUserPins.length ? (
          <ImageGrid
            listType="user"
            loggedIn={this.props.appState.loggedIn}
            title={`${this.props.profile.partialProfile.userName}'s Wall`}
            pins={this.props.pin.loggedInUserPins}
            removePin={this.removePin}
            handleDeleteDialogOpen={this.handleDeleteDialogOpen}
            handleDeleteDialogClose={this.handleDeleteDialogClose}
            deleteDialogOpen={this.state.deleteDialogOpen}
            selectedPin={this.state.selectedPin}
          />
        ) : (
          <div className={classes.container}>
            <Typography className={classes.message}>
              Your wall is empty! <br />
              <Link to="/new">Add some pins</Link> to get started.
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

UserPins.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }),
  pin: PropTypes.shape({
    error: PropTypes.string,
    pins: PropTypes.array,
    loggedInUserPins: PropTypes.array
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string,
      firstName: PropTypes.string
    })
  }),
  classes: PropTypes.object,
  apiPin: PropTypes.shape({
    getUserPins: PropTypes.func,
    addPin: PropTypes.func
  })
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch),
  apiProfile: bindActionCreators(apiProfileActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UserPins)
  )
);
