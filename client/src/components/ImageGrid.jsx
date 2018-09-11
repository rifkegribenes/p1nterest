import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Masonry from "react-masonry-component";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import pinIcon from "../img/pin.svg";
import Delete from "@material-ui/icons/Delete";

import AlertDialog from "./AlertDialog";

import * as apiPinActions from "../store/actions/apiPinActions";

import { BASE_URL } from "../store/actions/apiConfig.js";

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
    },
    "&:hover $ownerInfo": {
      visibility: "visible"
    }
  },
  ownerInfo: {
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
    padding: 15,
    visibility: "hidden"
  },
  userName: {
    marginLeft: 20
    // fontWeight: 700,
    // fontSize: "1.2em"
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
    padding: 10,
    borderBottom: "1px solid #ddd",
    textAlign: "center",
    fontWeight: 700,
    fontSize: "1.2em"
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

class ImageGrid extends React.Component {
  openAddPinDialog = tile => {
    if (this.props.listType === "search") {
      console.log("setting flickr true");
      this.props.apiPin.setFlickr(true);
    }
    if (this.props.appState.loggedIn) {
      console.log("this should open the addpin dialog");
      this.props.apiPin.handleAddPinOpen(tile);
    } else {
      window.localStorage.setItem("redirect", "/new");
      window.localStorage.setItem("pin", JSON.stringify(tile));
      if (this.props.listType === "search") {
        window.localStorage.setItem("flickr", true);
      }
      window.location.href = `${BASE_URL}/api/auth/github`;
    }
  };

  render() {
    const { classes } = this.props;
    const masonryOptions = {
      itemSelector: ".card",
      gutter: 10,
      columnWidth: 300,
      fitWidth: true
    };
    const tileData =
      this.props.listType === "search"
        ? this.props.pin.imageSearchResults
        : this.props.listType === "user"
          ? this.props.pin.loggedInUserPins
          : this.props.pin.pins;
    return (
      <div className={classes.root}>
        <Typography
          variant="headline"
          style={{ height: "auto", textAlign: "center", marginBottom: 10 }}
        >
          {this.props.title}
        </Typography>
        <Masonry options={masonryOptions} className={classes.masonry}>
          {tileData.map(tile => {
            const owner = this.props.profile.profile._id === tile.userId;
            return (
              <div className="card" style={cardStyle} key={tile.id || tile._id}>
                {this.props.listType === "user" &&
                  this.props.deleteDialogOpen &&
                  this.props.selectedPin._id === tile._id && (
                    <AlertDialog
                      pin={tile}
                      handleClose={this.props.handleDeleteDialogClose}
                      open={this.props.deleteDialogOpen}
                      content={`Delete Pin?`}
                      action={() => {
                        this.props.removePin(tile);
                        this.props.handleDeleteDialogClose();
                      }}
                      buttonText="Delete"
                    />
                  )}
                <div
                  className={classes.actionArea}
                  onClick={() => {
                    if (owner) {
                      return null;
                    } else {
                      this.openAddPinDialog(tile);
                    }
                  }}
                  tabIndex={0}
                >
                  {!owner && (
                    <Button
                      className={classes.pinButton}
                      onClick={() => this.openAddPinDialog(tile)}
                      color="primary"
                      variant="raised"
                      aria-label="Save Pin"
                    >
                      <img src={pinIcon} alt="" className={classes.pinIcon} />
                      Save
                    </Button>
                  )}
                  {this.props.listType === "user" && (
                    <Button
                      className={classes.pinButton}
                      onClick={() => this.props.handleDeleteDialogOpen(tile)}
                      color="primary"
                      variant="fab"
                      aria-label="Delete Pin"
                    >
                      <Delete />
                    </Button>
                  )}
                </div>
                <img
                  className={classes.image}
                  src={tile.url || tile.imageUrl}
                  alt={tile.snippet || tile.title}
                />
                <Typography component="p" className={classes.caption}>
                  {tile.snippet || tile.title}
                </Typography>
                {this.props.listType !== "search" && (
                  <Link
                    className={classes.ownerInfo}
                    to={`/userpins/${tile.userId}`}
                  >
                    <Avatar
                      alt={tile.userName}
                      src={tile.userAvatarUrl}
                      className={classes.avatar}
                    />
                    <Typography component="p" className={classes.userName}>
                      By {tile.userName}
                    </Typography>
                  </Link>
                )}
              </div>
            );
          })}
        </Masonry>
      </div>
    );
  }
}

ImageGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(ImageGrid)
  )
);
