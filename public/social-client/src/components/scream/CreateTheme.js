import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MyButton from "../../util/myButton";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import { postTheme, clearErrors } from "../../redux/actions/dataActions";
import BrushIcon from "@material-ui/icons/Brush";
import { getUserData } from "../../redux/actions/userActions";

import { withRouter } from 'react-router-dom';
const styles = (theme) => ({
  ...theme,
  submitButton: {
    position: "relative",
    float: "right",
    marginTop: 10,
  },
  progressSpinner: {
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    left: "91%",
    top: "6%",
  },
});

class CreateTheme extends Component {
  state = {
    body: "",
    open: false,
    errors: {},
    userHandle: this.props.user.credentials.userHandle,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (!nextProps.errors && !nextProps.loading) {
      this.setState({
        body: "",
        open: false,
        errors: {},
      });
    }
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, errors: {} });
    this.props.clearErrors();
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleSubmit = () => {
    const themeName = {
      themeName: this.state.body,
    };
    const {history} = this.props;
    this.props.postTheme(themeName,history);
    this.props.getUserData(this.state.userHandle);
  };

  render() {
    const { errors } = this.state;
    const { classes, loading } = this.props;
    return (
      <Fragment>
        <MyButton tip="Create a Theme" onClick={this.handleOpen}>
          <BrushIcon />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton
            tip="close"
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </MyButton>
          <DialogTitle>Create New Theme</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="body"
                type="text"
                label="Create new Theme"
                multiline
                rows="3"
                placeholder="Theme name here!"
                error={errors.error ? true : false}
                helperText={errors.error}
                className={classes.textField}
                value={this.state.body}
                onChange={this.handleChange}
                fullWidth
                inputProps={{ maxLength: 9 }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleSubmit}
              className={classes.submitButton}
              variant="contained"
              disabled={loading}
              color="primary"
            >
              Create a Theme
              {loading && (
                <CircularProgress
                  size={30}
                  className={classes.progressSpinner}
                />
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

CreateTheme.propTypes = {
  postTheme: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  loading: state.UI.loading,
  errors: state.UI.errors,
  user: state.user,
});

export default withRouter(connect(mapStateToProps, {
  postTheme,
  getUserData,
  clearErrors,
})(withStyles(styles)(CreateTheme)));
