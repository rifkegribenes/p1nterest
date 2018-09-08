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
import AddPinDialog from "../components/AddPinDialog";

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
      description: "",
      dialogOpen: false,
      selectedPin: {},
      flickr: false
    };
  }

  componentDidMount() {
    // window.localStorage.removeItem("pin");
    const pinToAdd = JSON.parse(window.localStorage.getItem("pin"));
    const flickr = window.localStorage.getItem("flickr");
    const userId = this.props.profile.profile._id;
    // console.log(this.props.profile.profile);
    // console.log(userId);
    // console.log(pinToAdd);
    if (pinToAdd && userId !== pinToAdd.userId) {
      this.setState(
        {
          selectedPin: { ...pinToAdd }
        },
        () => {
          // console.log(this.state.selectedPin);
          this.handleOpen(this.state.selectedPin, flickr);
        }
      );
    }
  }

  handleInput = ({ target: { name, value } }) =>
    this.setState({
      [name]: value
    });

  handleOpen = (selectedPin, flickr) => {
    this.setState({
      dialogOpen: true,
      selectedPin: { ...selectedPin },
      flickr
    });
  };

  handleClose = () => {
    console.log("close");
    this.setState({
      dialogOpen: false,
      selectedPin: {}
    });
    window.localStorage.removeItem("pin");
  };

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
      description: "",
      dialogOpen: false,
      selectedPin: {}
    });
  };

  addPin = (e, selectedPin, flickr) => {
    e.preventDefault();
    console.log(selectedPin);
    let { imageUrl, siteUrl, title, description } = this.state;
    const userId = this.props.profile.profile._id;
    const { userName, avatarUrl } = this.props.profile.profile;
    if (selectedPin) {
      imageUrl = flickr ? selectedPin.url : selectedPin.imageUrl;
      siteUrl = flickr ? selectedPin.context : selectedPin.siteUrl;
    }
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
    console.log(body);

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
      (imageUrl &&
        title &&
        !!imageUrlField.validity.valid &&
        !!siteUrlField.validity.valid &&
        !!titleField.validity.valid) ||
      (flickr && title)
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
            this.handleClose();
          }
        })
        .catch(err => openSnackbar("error", err));
    } else {
      openSnackbar(
        "error",
        `${
          flickr
            ? "Please enter a title."
            : "Please enter a valid image URL (including http://) and a title to add a new pin."
        }`
      );
    }
  };

  render() {
    const { classes, ...other } = this.props;
    return (
      <div className="addPin">
        <Notifier />
        {this.state.dialogOpen && (
          <AddPinDialog
            flickr={this.state.flickr}
            open={this.state.dialogOpen}
            handleClose={this.handleClose}
            handleInput={this.handleInput}
            selectedPin={this.state.selectedPin}
            addPin={this.addPin}
            pin={this.props.pin}
            imageUrl={this.state.imageUrl}
            siteUrl={this.state.siteUrl}
            title={this.state.title}
            description={this.state.description}
          />
        )}
        <div className={this.props.classes.wrapper}>
          <div className={this.props.classes.widget}>
            <RePin classes={this.props.classes} />
          </div>
          <div className={this.props.classes.widget}>
            <AddLink
              handleInput={this.handleInput}
              handleClose={this.handleClose}
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
          <SearchResults
            handleInput={this.handleInput}
            handleOpen={this.handleOpen}
            handleClose={this.handleClose}
            dialogOpen={this.state.dialogOpen}
            selectedPin={this.state.selectedPin}
            addPin={this.addPin}
            pin={this.props.pin}
            imageUrl={this.state.imageUrl}
            siteUrl={this.state.siteUrl}
            title={this.state.title}
            description={this.state.description}
            clearSearch={this.clearForm}
          />
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
