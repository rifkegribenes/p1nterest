import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiPinActions from "../store/actions/apiPinActions";

import Notifier, { openSnackbar } from "./Notifier";
import PinList from "../components/PinList";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  container: {
    padding: "0px 20px 60px 20px"
  },
  item: {
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap"
    }
  },
  button: {
    margin: theme.spacing.unit,
    flex: "0 0 auto",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 20,
      top: 20,
      flex: "1 1 auto"
    }
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  pinInfo: {
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  }
});

class SearchResults extends Component {
  addPin = pin => {
    const token = this.props.appState.authToken;
    const userId = this.props.profile.profile._id;
    if (!this.props.appState.loggedIn || !userId || !token) {
      openSnackbar("error", "Please log in to add a pin");
      return;
    }

    if (pin) {
      pin.owner = userId;
      this.props.apiPin
        .addPin(token, pin)
        .then(result => {
          openSnackbar("success", `Added ${pin.title} to your library.`);
          this.props.clearSearch();
          this.props.history.push("/library");
        })
        .catch(err => openSnackbar("error", err));
    } else {
      openSnackbar("error", "Sorry, no pins found.");
    }
  };

  setRedirect = pin => {
    console.log(pin);
    window.localStorage.setItem("redirect", "/mypins");
    window.localStorage.setItem("pin", JSON.stringify(pin));
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <Notifier />
        <ImageGrid
          listType="search"
          loggedIn={this.props.appState.loggedIn}
          title="Search Results"
          images={this.props.pin.imageSearchResults}
          addPin={this.addPin}
          setRedirect={this.setRedirect}
          classes={this.props.classes}
        />
      </div>
    );
  }
}

SearchResults.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }),
  pin: PropTypes.shape({
    imageSearchResults: PropTypes.array
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string
    })
  }),
  classes: PropTypes.object,
  apiPin: PropTypes.shape({
    getAllPins: PropTypes.func,
    addPin: PropTypes.func
  }),
  clearSearch: PropTypes.func
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SearchResults)
  )
);
