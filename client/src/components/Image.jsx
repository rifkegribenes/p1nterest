import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import placeholder from "../img/placeholder.png";

const styles = theme => ({
  image: {
    width: 280,
    height: "auto",
    borderRadius: 6,
    margin: 10
  }
});

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false
    };
  }

  handleError = () => {
    console.log("image load error");
    this.setState({
      error: true
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <img
        className={classes.image}
        src={this.state.error ? placeholder : this.props.imageUrl}
        alt={this.props.title}
        onError={this.handleError}
      />
    );
  }
}

Image.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  imageUrl: PropTypes.string
};

export default withStyles(styles)(Image);
