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
  },
  singleImage: {
    borderRadius: 6,
    width: 480,
    maxWidth: "100%",
    height: "auto",
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
    const single = this.props.type === "single";
    return (
      <img
        className={single ? classes.singleImage : classes.image}
        src={this.state.error ? placeholder : this.props.imageUrl}
        alt={this.props.title}
        onError={() => {
          this.handleError();
          this.props.handleParentError();
        }}
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
