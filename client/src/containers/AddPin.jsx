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
    display: "flex"
  },
  form: {
    margin: "auto",
    width: "100%",
    maxWidth: 600,
    height: 92,
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
  }
});

class AddPin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: ""
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

  clearSearch = () => {
    this.props.apiPin.clearSearchResults();
    this.setState({
      keyword: ""
    });
  };

  render() {
    return (
      <div className="addPin">
        <Notifier />
        <div className={this.props.classes.wrapper}>
          <RePin classes={this.props.classes} />
          <AddLink
            handleInput={this.handleInput}
            addPin={this.addPin}
            classes={this.props.classes}
            pin={this.props.pin}
          />
          <Search
            keyword={this.state.keyword}
            handleInput={this.handleInput}
            searchImage={this.searchImage}
            classes={this.props.classes}
            pin={this.props.pin}
          />
        </div>
        {this.props.pin.imageSearchResults.length ? (
          <SearchResults clearSearch={this.clearSearch} />
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
    )(AddPin)
  )
);
