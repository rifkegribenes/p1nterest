import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Masonry from "react-masonry-component";
// import CardActionArea from "@material-ui/core/CardActionArea";
import Button from "@material-ui/core/Button";
import withWidth from "@material-ui/core/withWidth";
// import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import pinIcon from "../img/pin.svg";

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
  pinButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 0,
    visibility: "hidden"
  },
  actionArea: {
    borderRadius: 4,
    zIndex: 1,
    "&:hover": {
      backgroundColor: "rgba(0,0,0,.25)"
    },
    "&:hover $pinButton": {
      visibility: "visible",
      zIndex: 2
    }
  },
  pinIcon: {
    height: 27,
    marginLeft: -9,
    width: "auto"
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
  }
});

const cardStyle = {
  marginBottom: 10,
  borderRadius: 4,
  width: 300,
  position: "relative"
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
        {props.title}
      </Typography>
      <Masonry options={masonryOptions} className={classes.masonry}>
        {/*        <div className="grid-sizer" style={{ width: "160px"}}/>*/}
        {props.tileData.map(tile => (
          <div className="card" style={cardStyle} key={tile.id || tile._id}>
            <div className={classes.actionArea}>
              <Button
                className={classes.pinButton}
                onClick={() => props.openAddPinDialog(tile)}
                color="primary"
                variant="raised"
              >
                <img src={pinIcon} alt="" className={classes.pinIcon} />
                Add Pin
              </Button>
              <img
                className={classes.media}
                src={tile.url || tile.imageUrl}
                alt={tile.snippet || tile.title}
              />
              <Typography component="p" className={classes.caption}>
                {tile.snippet || tile.title}
              </Typography>
            </div>
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
