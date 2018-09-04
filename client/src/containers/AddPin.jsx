import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as apiPinActions from "../store/actions/apiPinActions";

import Search from "../components/Search";
import SearchResults from "./SearchResults";
import Notifier, { openSnackbar } from "./Notifier";
import RePin from "../components/RePin";
import AddLink from "../components/AddLink";

import { withStyles } from "@material-ui/core/styles";

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
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      imageUrl: "",
      siteUrl: "",
      title: "",
      description: ""
    };
  }

  handleInput = ({ target: { name, value } }) =>
    this.setState({
      [name]: value
    });

  searchImage = () => {
    const keyword = encodeURIComponent(this.state.keyword);

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

  clearForm = () => {
    this.props.apiPin.clearSearchResults();
    this.setState({
      keyword: "",
      imageUrl: "",
      siteUrl: "",
      title: "",
      description: ""
    });
  };

  addPin = e => {
    e.preventDefault();
    const { imageUrl, siteUrl, title, description } = this.state;
    const userId = this.props.profile.profile._id;
    const { userName, avatarUrl } = this.props.profile.profile;
    const token = this.props.appState.authToken;
    const body = {
      imageUrl,
      siteUrl,
      title,
      description,
      userId,
      userName,
      avatarUrl
    };

    if (!token) {
      // change this to redirect to login
      // with body and redirect saved to localStorage
      openSnackbar("error", "Please log in to add a pin.");
    }

    const imageUrlField = document.getElementById("imageUrl");
    const siteUrlField = document.getElementById("siteUrl");
    const titleField = document.getElementById("title");
    const fieldsToValidate = [imageUrlField, siteUrlField, titleField];
    fieldsToValidate.forEach(field => field.checkValidity());

    if (
      imageUrl &&
      title &&
      !!imageUrlField.validity.valid &&
      !!siteUrlField.validity.valid &&
      !!titleField.validity.valid
    ) {
      this.props.apiPin
        .addPin(token, body)
        .then(result => {
          if (result.type === "ADD_PIN_FAILURE" || this.props.pin.error) {
            openSnackbar(
              "error",
              this.props.pin.error ||
                "Sorry, something went wrong, please try again."
            );
          } else if (result.type === "ADD_PIN_SUCCESS") {
            openSnackbar("success", "Pin added.");
            this.clearForm();
          }
        })
        .catch(err => openSnackbar("error", err));
    } else {
      openSnackbar(
        "error",
        "Please enter a valid image URL (including http://) and a title to add a new pin."
      );
    }
  };

  render() {
    return (
      <div className="addPin">
        <Notifier />
        <div className={this.props.classes.wrapper}>
          <div className={this.props.classes.widget}>
            <RePin classes={this.props.classes} />
          </div>
          <div className={this.props.classes.widget}>
            <AddLink
              handleInput={this.handleInput}
              addPin={this.addPin}
              classes={this.props.classes}
              pin={this.props.pin}
              imageUrl={this.state.imageUrl}
              siteUrl={this.state.siteUrl}
              title={this.state.title}
              description={this.state.description}
            />
          </div>
          <div className={this.props.classes.widget}>
            <Search
              keyword={this.state.keyword}
              handleInput={this.handleInput}
              searchImage={this.searchImage}
              classes={this.props.classes}
              pin={this.props.pin}
            />
          </div>
        </div>
        {this.props.pin.imageSearchResults.length ? (
          <SearchResults clearSearch={this.clearForm} />
        ) : null}
      </div>
    );
  }
}

AddPin.propTypes = {
  pin: PropTypes.shape({
    imageSearchResults: PropTypes.array,
    error: PropTypes.string
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
