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
import Profile from "./containers/Profile";
import Logout from "./containers/Logout";
// import UserPins from "./containers/UserPins";
import AddPin from "./containers/AddPin";
import AllPins from "./containers/AllPins";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  hero: {
    marginRight: 20,
    height: 150,
    width: "auto"
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

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <main className="main" id="main">
          <Switch>
            <Route
              exact
              path="/"
              render={routeProps => (
                <AllPins classes={this.props.classes} {...routeProps} />
              )}
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
