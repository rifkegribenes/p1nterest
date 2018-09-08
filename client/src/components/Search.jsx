import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import * as apiPinActions from "../store/actions/apiPinActions";

import ButtonWithSpinner from "./ButtonWithSpinner";

class Search extends React.Component {
  render() {
    return (
      <div style={{ padding: 20 }}>
        <Typography
          variant="headline"
          align="center"
          gutterBottom
          style={{ paddingTop: 20 }}
        >
          Search for an image on Flickr
        </Typography>
        <form
          className={this.props.classes.form}
          onError={errors => console.log(errors)}
        >
          <TextField
            name="keyword"
            label="Keywords"
            value={this.props.pin.form.keyword}
            onChange={this.props.apiPin.handleInput}
            className={this.props.classes.input}
          />
          <ButtonWithSpinner
            type="button"
            color="primary"
            className={this.props.classes.button}
            variant="raised"
            onClick={this.props.searchImage}
            loading={this.props.pin.loading}
          >
            Search images
          </ButtonWithSpinner>
        </form>
      </div>
    );
  }
}

Search.propTypes = {
  pin: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.string
  }),
  keyword: PropTypes.string,
  handleInput: PropTypes.func,
  searchImage: PropTypes.func,
  classes: PropTypes.object
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Search)
);
