import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

import * as Actions from "./store/actions";
import * as apiPinActions from "./store/actions/apiPinActions";
import * as apiProfileActions from "./store/actions/apiProfileActions";

import NavBar from "./containers/NavBar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import AddPinDialog from "./components/AddPinDialog";
import Profile from "./containers/Profile";
import Logout from "./containers/Logout";
// import UserPins from "./containers/UserPins";
import AddPin from "./containers/AddPin";
import AllPins from "./containers/AllPins";

import Notifier, { openSnackbar } from "./containers/Notifier";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  notFound: {
    height: "80vh",
    width: "auto",
    marginTop: "-60px"
  },
  container: {
    maxWidth: 1200,
    padding: 60,
    margin: "auto",
    height: "100%",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  message: {
    margin: "auto",
    width: "50%",
    textAlign: "center",
    height: "50%",
    lineHeight: "2em"
  },
  row: {
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      flexWrap: "wrap"
    }
  },
  button: {
    height: 100,
    margin: "20px auto",
    width: 100
  },
  footer: {
    width: "100vw",
    margin: "auto",
    position: "fixed",
    backgroundColor: theme.palette.primary.main,
    bottom: 0,
    padding: 5,
    display: "flex",
    justifyContent: "center",
    boxShadow: "0 1px 5px 2px rgba(0,0,0,.2)"
  },
  footerIcon: {
    width: 20,
    height: "auto"
  }
});

class App extends Component {
  componentDidMount() {
    if (this.props.location.hash) {
      const hash = this.props.location.hash.slice(2);
      const url = `/${hash.split("=")[1]}`;
      this.props.history.push(url);
    }
    // If not logged in, check local storage for authToken
    // if it doesn't exist, it returns the string "undefined"
    if (!this.props.appState.loggedIn) {
      let token = window.localStorage.getItem("authToken");
      if (token && token !== "undefined") {
        token = JSON.parse(token);
        const userId = JSON.parse(window.localStorage.getItem("userId"));
        if (userId) {
          this.props.apiProfile.validateToken(token, userId).then(result => {
            if (result === "VALIDATE_TOKEN_FAILURE") {
              window.localStorage.clear();
            } else if (result === "VALIDATE_TOKEN_SUCESS") {
            }
          });
        }
      } else {
        // console.log("no token found in local storage");
      }
    } else {
      // console.log("logged in");
    }
  }

  addPin = (e, selectedPin) => {
    e.preventDefault();
    console.log(selectedPin);
    let { imageUrl, siteUrl, title, description, flickr } = this.props.pin.form;
    console.log(`flickr: ${flickr}`);
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
            this.props.apiPin.clearForm();
            this.props.apiPin.handleAddPinClose();
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

  handleClose = () => {
    this.props.apiPin.handleAddPinClose();
    window.localStorage.removeItem("pin");
  };

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <Notifier />
        <main className="main" id="main">
          {this.props.pin.form.dialogOpen && (
            <AddPinDialog
              flickr={this.props.pin.form.flickr}
              open={this.props.pin.form.dialogOpen}
              handleClose={this.handleClose}
              handleInput={this.props.apiPin.handleInput}
              selectedPin={this.props.pin.form.selectedPin}
              addPin={this.addPin}
              pin={this.props.pin}
              imageUrl={this.props.pin.form.imageUrl}
              siteUrl={this.props.pin.form.siteUrl}
              title={this.props.pin.form.title}
              description={this.props.pin.form.description}
            />
          )}
          <Switch>
            <Route
              exact
              path="/"
              render={routeProps => <AllPins {...routeProps} />}
            />
            <Route
              path="/profile/:id?/:token?"
              render={routeProps => <Profile {...routeProps} />}
            />
            {/*            <Route
              path="/mypins"
              render={routeProps => <UserPins {...routeProps} />}
            />*/}
            <Route
              path="/new"
              render={routeProps => <AddPin {...routeProps} />}
            />
            <Route
              path="/all"
              render={routeProps => <AllPins {...routeProps} />}
            />
            <Route
              path="/logout"
              render={routeProps => (
                <Logout classes={this.props.classes} {...routeProps} />
              )}
            />
            <Route
              path="*"
              render={routeProps => (
                <NotFound classes={this.props.classes} {...routeProps} />
              )}
            />
          </Switch>
        </main>
        <Footer classes={this.props.classes} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  pin: state.pin
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  apiPin: bindActionCreators(apiPinActions, dispatch),
  apiProfile: bindActionCreators(apiProfileActions, dispatch)
});

export default withStyles(styles)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(App)
  )
);
