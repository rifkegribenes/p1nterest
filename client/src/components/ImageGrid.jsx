import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
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
    color: "rgba(255, 255, 255, 0.54)"
  },
  pinIcon: {
    width: 20,
    height: "auto"
  }
});

const ImageGrid = props => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList} cols={6}>
        <GridListTile key="Subheader" cols={6} style={{ height: "auto" }}>
          <ListSubheader component="div">Search Results</ListSubheader>
        </GridListTile>
        {props.tileData.map(tile => (
          <GridListTile key={tile.id}>
            <img src={tile.url} alt={tile.snippet} />
            <GridListTileBar
              title={tile.snippet}
              actionIcon={
                <IconButton className={classes.icon} onClick={props.addPin}>
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

export default withStyles(styles)(ImageGrid);
