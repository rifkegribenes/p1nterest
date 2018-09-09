import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiPinActions from "../store/actions/apiPinActions";

import ImageGrid from "../components/ImageGrid";

import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 1920
  },
  container: {
    padding: "0px 20px 60px 20px"
  },
  item: {
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap"
    }
  },
  button: {
    margin: theme.spacing.unit,
    flex: "0 0 auto",
    [theme.breakpoints.down("sm")]: {
      position: "absolute",
      right: 20,
      top: 20,
      flex: "1 1 auto"
    }
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  pinInfo: {
    [theme.breakpoints.down("xs")]: {
      width: "100%"
    }
  }
});

class SearchResults extends Component {
  render() {
    return (
      <div className={this.props.classes.container}>
        <Divider style={{ margin: 20 }} />
        <ImageGrid
          listType="search"
          title="Search Results"
          tileData={this.props.pin.imageSearchResults}
          setRedirect={this.props.setRedirect}
          addPin={this.props.addPin}
        />
      </div>
    );
  }
}

SearchResults.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
  }),
  pin: PropTypes.shape({
    imageSearchResults: PropTypes.array
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      _id: PropTypes.string
    })
  }),
  classes: PropTypes.object,
  apiPin: PropTypes.shape({
    getAllPins: PropTypes.func,
    addPin: PropTypes.func
  }),
  clearSearch: PropTypes.func
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
    )(SearchResults)
  )
);
