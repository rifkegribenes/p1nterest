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
      Add a link by pasting in a URL
    </Typography>
    <form
      className={props.classes.form}
      onError={errors => console.log(errors)}
    >
      <TextField
        name="keyword"
        label="Keywords"
        value={props.keyword}
        onChange={props.handleInput}
        className={props.classes.input}
      />
      <ButtonWithSpinner
        type="button"
        color="primary"
        className={props.classes.button}
        variant="raised"
        onClick={props.searchImage}
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
