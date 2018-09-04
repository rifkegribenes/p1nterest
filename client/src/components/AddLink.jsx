import React from "react";
import PropTypes from "prop-types";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import ButtonWithSpinner from "./ButtonWithSpinner";

const AddLink = props => (
  <div style={{ padding: 20 }}>
    <Typography
      variant="headline"
      align="center"
      gutterBottom
      style={{ paddingTop: 20 }}
    >
      Add image by pasting in a URL
    </Typography>
    <form
      className={props.classes.form}
      onError={errors => console.log(errors)}
    >
      <TextField
        name="imageUrl"
        id="imageUrl"
        label="Image URL"
        type="url"
        required
        value={props.imageUrl}
        onChange={props.handleInput}
        className={props.classes.input}
      />
      <TextField
        name="siteUrl"
        id="siteUrl"
        label="Website URL"
        type="url"
        value={props.siteUrl}
        onChange={props.handleInput}
        className={props.classes.input}
      />
      <TextField
        name="title"
        id="title"
        label="Title"
        value={props.title}
        required
        onChange={props.handleInput}
        className={props.classes.input}
      />
      <TextField
        name="description"
        label="Description"
        value={props.description}
        onChange={props.handleInput}
        className={props.classes.input}
      />
      <ButtonWithSpinner
        type="submit"
        color="primary"
        className={props.classes.button}
        variant="raised"
        onClick={e => props.addPin(e)}
        loading={props.pin.loading}
      >
        Add link
      </ButtonWithSpinner>
    </form>
  </div>
);

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

export default AddLink;
