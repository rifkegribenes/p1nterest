import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";

import AddLink from "./AddLink";

const styles = theme => ({
  root: {
    margin: 0
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
  hidden: {
    visibility: "hidden",
    height: 0,
    overflow: "hidden"
  },
  dialogThumbnailWrap: {
    display: "flex",
    justifyContent: "center",
    height: 140,
    alignItems: "center"
  },
  dialogThumbnail: {
    height: 100,
    width: "auto"
  }
});

class AddPinDialog extends Component {
  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby={
            this.props.modalTitle
              ? "alert-dialog-title"
              : "Save pin to your wall"
          }
          aria-describedby="Save pin to your wall"
          PaperProps={{ classes: { root: "dialog-root" } }}
        >
          {this.props.modalTitle && (
            <DialogTitle id="alert-dialog-title">
              {this.props.modalTitle}
            </DialogTitle>
          )}
          <DialogContent>
            <AddLink
              flickr={this.props.flickr}
              formTitle="Save Pin"
              type="dialog"
              handleInput={this.props.handleInput}
              addPin={this.props.addPin}
              classes={this.props.classes}
              pin={this.props.pin}
              selectedPin={this.props.selectedPin}
              imageUrl={this.props.imageUrl}
              siteUrl={this.props.siteUrl}
              title={this.props.title}
              description={this.props.description}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.props.handleClose}
              variant="outlined"
              color="default"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

AddPinDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  buttonText: PropTypes.string,
  handleClose: PropTypes.func,
  action: PropTypes.func
};

export default withStyles(styles)(AddPinDialog);
