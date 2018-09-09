import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import * as apiPinActions from "../store/actions/apiPinActions";

import ButtonWithSpinner from "./ButtonWithSpinner";

class AddLink extends React.Component {
  addLink = e => {
    console.log("addLink");
    const dialog = this.props.type === "dialog";
    let pinToAdd;
    if (dialog) {
      pinToAdd = this.props.pin.form.selectedPin;
    } else {
      const { imageUrl, siteUrl, title, description } = this.props.pin.form;
      pinToAdd = {
        imageUrl,
        siteUrl,
        title,
        description
      };
    }
    this.props.addPin(e, pinToAdd);
  };

  render() {
    const dialog = this.props.type === "dialog";
    return (
      <div style={{ padding: "20 20 0 20" }}>
        <Typography
          variant="headline"
          align="center"
          gutterBottom
          style={{ paddingTop: 20 }}
        >
          {dialog ? "Save to your wall" : "Add image by pasting in a URL"}
        </Typography>
        <div className={this.props.classes.dialogThumbnailWrap}>
          <img
            src={
              dialog
                ? this.props.pin.form.selectedPin.imageUrl ||
                  this.props.pin.form.selectedPin.url
                : this.props.imageUrl
            }
            className={this.props.classes.dialogThumbnail}
            alt={this.props.title}
          />
        </div>
        <form
          className={this.props.classes.form}
          onError={errors => console.log(errors)}
        >
          <TextField
            name="imageUrl"
            id="imageUrl"
            label="Image URL"
            type="url"
            required
            value={
              dialog
                ? this.props.pin.form.selectedPin.imageUrl ||
                  this.props.pin.form.selectedPin.url
                : this.props.pin.form.imageUrl
            }
            onChange={this.props.apiPin.handleInput}
            className={
              dialog ? this.props.classes.hidden : this.props.classes.input
            }
          />
          <TextField
            name="siteUrl"
            id="siteUrl"
            label="Website URL"
            type="url"
            value={
              dialog
                ? this.props.pin.form.selectedPin.siteUrl ||
                  this.props.pin.form.selectedPin.context
                : this.props.pin.form.siteUrl
            }
            onChange={this.props.apiPin.handleInput}
            className={
              dialog ? this.props.classes.hidden : this.props.classes.input
            }
          />
          <TextField
            name="title"
            id="title"
            label="Title"
            value={this.props.pin.form.title}
            required
            onChange={this.props.apiPin.handleInput}
            className={this.props.classes.input}
          />
          <TextField
            name="description"
            label="Description"
            value={this.props.pin.form.description}
            onChange={this.props.apiPin.handleInput}
            className={this.props.classes.input}
          />
          <ButtonWithSpinner
            type="submit"
            color="primary"
            className={this.props.classes.button}
            variant="raised"
            onClick={this.addLink}
            loading={this.props.pin.loading}
          >
            Save pin
          </ButtonWithSpinner>
        </form>
      </div>
    );
  }
}

AddLink.propTypes = {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLink);
