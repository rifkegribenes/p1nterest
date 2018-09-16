import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiProfileActions from "../store/actions/apiProfileActions";
import * as apiPinActions from "../store/actions/apiPinActions";

import ImageGrid from "../components/ImageGrid";

import { openSnackbar } from "./Notifier";

class AllPins extends Component {
  componentDidMount() {
    this.props.apiPin
      .getAllPins()
      .then(result => {
        console.log(result.type);
        if (result.type === "GET_ALL_PINS_FAILURE" || this.props.pin.error) {
          openSnackbar(
            "error",
            this.props.pin.error ||
              "Sorry, something went wrong while fetching pins."
          );
        }
      })
      .catch(err => {
        console.log(err);
        openSnackbar("error", err);
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
  pin: PropTypes.shape({
    error: PropTypes.string
  }),
  apiPin: PropTypes.shape({
    getAllPins: PropTypes.func
  })
};

const mapStateToProps = state => ({
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AllPins)
);
