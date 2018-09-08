import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiPinActions from "../store/actions/apiPinActions";

import Search from "../components/Search";
import SearchResults from "./SearchResults";
import RePin from "../components/RePin";
import AddLink from "../components/AddLink";

import { withStyles } from "@material-ui/core/styles";

import { openSnackbar } from "./Notifier";

const styles = theme => ({
  root: {
    margin: 20,
    padding: 20,
    maxWidth: 400
  },
  container: {
    padding: "20px 20px 60px 20px",
    display: "flex",
    flexDirection: "column"
  },
  wrapper: {
    display: "flex",
    margin: "0 auto",
    justifyContent: "center"
  },
  form: {
    margin: "auto",
    width: "100%",
    maxWidth: 600,
    paddingBottom: 20,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    height: "100%"
  },
  button: {
    width: "100%",
    flex: "1 1 auto",
    marginTop: 20
  },
  input: {
    width: "100%"
  },
  widget: {
    maxWidth: "33%"
  }
});

class AddPin extends Component {
  componentDidMount() {
    window.localStorage.removeItem("pin");
    const pinToAdd = JSON.parse(window.localStorage.getItem("pin"));
    const flickr = window.localStorage.getItem("flickr");
    const userId = this.props.profile.profile._id;
    // console.log(this.props.profile.profile);
    // console.log(userId);
    // console.log(pinToAdd);
    if (pinToAdd && userId !== pinToAdd.userId) {
      this.props.apiPin.setSelectedPin(pinToAdd);
      // console.log(this.props.pin.selectedPin);
      this.props.apiPin.handleAddPinOpen(pinToAdd, flickr);
    }
  }

  searchImage = () => {
    const keyword = encodeURIComponent(this.props.pin.form.keyword);

    if (keyword) {
      this.props.apiPin
        .searchImage(keyword)
        .then(result => {
          if (result === "SEARCH_IMAGE_FAILURE" || this.props.pin.error) {
            openSnackbar("error", "Sorry, no images found.");
          }
        })
        .catch(err => openSnackbar("error", err));
    } else {
      openSnackbar("error", "Please enter a keyword to search.");
    }
  };

  render() {
    return (
      <div className="addPin">
        <div className={this.props.classes.wrapper}>
          <div className={this.props.classes.widget}>
            <RePin classes={this.props.classes} />
          </div>
          <div className={this.props.classes.widget}>
            <AddLink classes={this.props.classes} pin={this.props.pin} />
          </div>
          <div className={this.props.classes.widget}>
            <Search
              searchImage={this.searchImage}
              classes={this.props.classes}
              pin={this.props.pin}
            />
          </div>
        </div>
        {this.props.pin.imageSearchResults.length ? <SearchResults /> : null}
      </div>
    );
  }
}

AddPin.propTypes = {
  pin: PropTypes.shape({
    imageSearchResults: PropTypes.array,
    error: PropTypes.string
  }),
  profile: PropTypes.shape({
    profile: PropTypes.shape({
      userId: PropTypes.String
    })
  }),
  apiPin: PropTypes.shape({
    clearSearchResults: PropTypes.func,
    searchImage: PropTypes.func
  }),
  classes: PropTypes.object
};

const mapStateToProps = state => ({
  pin: state.pin,
  profile: state.profile,
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  apiPin: bindActionCreators(apiPinActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(AddPin)
  )
);
