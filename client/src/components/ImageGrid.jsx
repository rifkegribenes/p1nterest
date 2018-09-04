import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Masonry from "react-masonry-component";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
import CardMedia from "@material-ui/core/CardMedia";
// import IconButton from "@material-ui/core/IconButton";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
// import pinIcon from "../img/pin.svg";

const styles = theme => ({
  root: {
    margin: "0 auto",
    width: "100%",
    maxWidth: 1920
  },
  gridList: {},
  card: {
    // this class is being used directly, so can't set options in JSS
  },
  masonry: {
    margin: "0 auto"
  },
  caption: {
    padding: 10
  },
  media: {
    width: 300,
    height: "auto",
    borderRadius: "4px 4px 0 0"
  },
  icon: {
    color: theme.palette.primary.main
  },
  pinIcon: {
    width: 20,
    height: "auto"
  }
});

const cardStyle = {
  marginBottom: 10,
  borderRadius: 4,
  width: 300
};

const ImageGrid = props => {
  const { classes } = props;
  const masonryOptions = {
    itemSelector: ".card",
    gutter: 10,
    columnWidth: 300,
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
          <div className="card" style={cardStyle} key={tile.id}>
            <CardActionArea>
              <img
                className={classes.media}
                src={tile.url}
                alt={tile.snippet}
              />
              <Typography component="p" className={classes.caption}>
                {tile.snippet}
              </Typography>
            </CardActionArea>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

ImageGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles)(ImageGrid));
