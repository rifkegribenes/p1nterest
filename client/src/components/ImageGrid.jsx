import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Masonry from "react-masonry-component";
// import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
// import IconButton from "@material-ui/core/IconButton";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
// import pinIcon from "../img/pin.svg";

const styles = theme => ({
  root: {
    margin: "0 auto",
    width: "100%",
    maxWidth: 1500
  },
  gridList: {},
  card: {
    // this class is being used directly, so can't set options in JSS
  },
  media: {
    objectFit: "cover"
  },
  masonry: {
    margin: "0 auto"
  },
  icon: {
    color: theme.palette.primary.main
  },
  pinIcon: {
    width: 20,
    height: "auto"
  }
});

const ImageGrid = props => {
  const { classes } = props;
  const masonryOptions = {
    itemSelector: ".card",
    gutter: 10,
    fitWidth: true
  };
  return (
    <div className={classes.root}>
      <Typography
        variant="headline"
        style={{ height: "auto", textAlign: "center", marginBottom: 10 }}
      >
        Search Results
      </Typography>
      <Masonry options={masonryOptions} className={classes.masonry}>
        {/*        <div className="grid-sizer" style={{ width: "160px"}}/>*/}
        {props.tileData.map(tile => (
          <img
            className="card"
            style={{ marginBottom: 10 }}
            src={tile.url}
            alt={tile.snippet}
            key={tile.id}
          />
        ))}
      </Masonry>
    </div>
  );
};

ImageGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles)(ImageGrid));
