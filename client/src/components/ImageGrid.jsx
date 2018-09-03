import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import pinIcon from "../img/pin.svg";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {},
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
  let cols = 1;
  console.log(props.width);
  if (isWidthUp("sm", props.width)) {
    cols = 2;
  }
  if (isWidthUp("md", props.width)) {
    cols = 3;
  }
  if (isWidthUp("lg", props.width)) {
    cols = 4;
  }
  if (isWidthUp("xl", props.width)) {
    cols = 6;
  }
  console.log(cols);

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList} cols={cols}>
        <GridListTile key="Subheader" cols={cols} style={{ height: "auto" }}>
          <ListSubheader component="div">Search Results</ListSubheader>
        </GridListTile>
        {props.tileData.map(tile => (
          <GridListTile key={tile.id}>
            <img src={tile.url} alt={tile.snippet} />
            <GridListTileBar
              title={tile.snippet}
              actionIcon={
                <IconButton
                  className={classes.icon}
                  onClick={props.openAddPinDialog}
                >
                  <img src={pinIcon} alt="" className={classes.pinIcon} />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

ImageGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withWidth()(withStyles(styles)(ImageGrid));
