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
    visibility: "hidden"
  },
  actionArea: {
    borderRadius: 4,
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(0,0,0,.05)"
    },
    "&:hover $pinButton": {
      visibility: "visible"
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
    padding: 20
  },
  image: {
    width: 280,
    height: "auto",
    borderRadius: "4px",
    margin: 10
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
            <div
              className={classes.actionArea}
              onClick={() => props.openAddPinDialog(tile)}
              tabIndex={0}
            >
              <Button
                className={classes.pinButton}
                onClick={() => props.openAddPinDialog(tile)}
                color="primary"
                variant="raised"
              >
                <img src={pinIcon} alt="" className={classes.pinIcon} />
                Save
              </Button>
            </div>
            <img
              className={classes.image}
              src={tile.url || tile.imageUrl}
              alt={tile.snippet || tile.title}
            />
            <Typography component="p" className={classes.caption}>
              {tile.snippet || tile.title}
            </Typography>
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
