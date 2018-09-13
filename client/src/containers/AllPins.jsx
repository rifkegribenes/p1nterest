import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiPinActions from "../store/actions/apiPinActions";

import ImageGrid from "../components/ImageGrid";
import { withStyles } from "@material-ui/core/styles";

import { openSnackbar } from "./Notifier";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1200
  },
  button: {
    margin: theme.spacing.unit,
    flex: "0 0 auto",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 7,
      top: 20,
      flex: "1 1 auto"
    }
  },
  owner: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
      padding: "0 10px"
    }
  },
  offered: {
    [theme.breakpoints.down("sm")]: {
      padding: 0
    }
  },
  contentBold: {
    fontWeight: "bold"
  },
  container: {
    width: "100%",
    height: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: 40
  },
  item: {
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap"
    }
  },
  pinInfo: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "0 10px"
    }
  },
  avatar: {
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 20,
      bottom: 15
    }
  }
});

class AllPins extends Component {
  componentDidMount() {
    this.props.apiPin.getAllPins().then(result => {
      if (result.type === "GET_ALL_PINS_FAILURE" || this.props.pin.error) {
        openSnackbar(
          "error",
          this.props.pin.error ||
            "Sorry, something went wrong while fetching pins."
        ).catch(err => {
          console.log(err);
          openSnackbar("error", err);
        });
      }
    });
  }

  render() {
    return (
      <div className="pinList">
        <ImageGrid listType="all" />
      </div>
    );
  }
}

AllPins.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }),
  pin: PropTypes.shape({
    pins: PropTypes.array
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string,
      userName: PropTypes.string,
      avatarUrl: PropTypes.string
    }),
    partialProfile: PropTypes.shape({
      _id: PropTypes.string,
      userName: PropTypes.string,
      avatarUrl: PropTypes.string
    })
  }),
  classes: PropTypes.object,
  apiProfile: PropTypes.shape({
    getPartialProfile: PropTypes.func
  }),
  apiPin: PropTypes.shape({
    getAllPins: PropTypes.func,
    updatePinlist: PropTypes.func
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
    )(AllPins)
  )
);
