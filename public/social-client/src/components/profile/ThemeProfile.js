import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Button from "@material-ui/core/Button";
import MuiLink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import ProfileSkeleton from "../../util/ProfileSkeleton";
import Typography from "@material-ui/core/Typography";
import CalendarToday from "@material-ui/icons/CalendarToday";
import MyButton from "../../util/myButton";
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import { connect } from "react-redux";
import EditDetailsTheme from "./EditDetailsTheme";
import CircularProgress from "@material-ui/core/CircularProgress";
import { followTheme, unFollowTheme } from "../../redux/actions/userActions";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { deleteTheme } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme,
  open: false
});
class ThemeProfile extends Component {

  state = {
    loadingFollow: false,
    following: this.props.user.credentials.following,
    description: this.props.themeData.description
  }
    
  
  componentWillReceiveProps(nextProps) {
    if(nextProps.user.credentials.following) {
        this.setState({following: nextProps.user.credentials.following})
    }
    
}

  changeDescription = (description) => {
    this.setState({description})
  }

  handleOpen = () => {
    this.setState({open: true})
  }
  handleClose = () => {
    this.setState({open: false})
  }

  render() {
    const {
      classes,
      user: {
        credentials: { userHandle, following },
        loading,
        authenticated,
      },
      themeData: { themeName, members, createdBy, description, createdAt },
    } = this.props;

    const checkFollowed = this.state.following && this.state.following.find((user) => {
      return user.userHandle === themeName;
    });
    console.log('foloowing: ', this.state.following)


    const handleFollow = (themeName) => {
      this.setState({loadingFollow: true})
      this.props.followTheme(themeName);
      this.setState({loadingFollow: false})
    };
    const handleUnFollow = (themeName) => {
      this.setState({loadingFollow: true})
      this.props.unFollowTheme(themeName);
      this.setState({loadingFollow: false})
    };

    const handleDelete = (themeName) => {
      this.props.deleteTheme(themeName, this.props.history)
    }

    let profileMarkup = (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="profile-details">
            <MuiLink
              component={Link}
              to={`/themes/${themeName}`}
              color="secondary"
              variant="h5"
            >
              #{themeName}
            </MuiLink>
            <hr />
            {this.state.description && <Typography variant="body2">{this.state.description}</Typography>}
            <CalendarToday color="primary" />{" "}
            <span>Created At {dayjs(createdAt).format("MMM YYYY")}</span>
          </div>
          {userHandle == createdBy && (
            <React.Fragment>
              
              <MyButton tip="Delete" onClick={this.handleOpen}>
                <DeleteIcon color="primary" />
              </MyButton>
              <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            fullWidth
            maxWidth="sm">
                <DialogTitle>Delete Theme</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Are you sure you want to delete this Theme ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDelete(themeName)} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

              <EditDetailsTheme func = {this.changeDescription} themeData = {this.props.themeData} />
            </React.Fragment>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          {userHandle != createdBy && !checkFollowed ? (
            <Button
              variant="contained"
              color="primary"
              className="follow-bottom"
              onClick={() => handleFollow(themeName)}
              disabled={loading}
            >
              {this.state.loadingFollow && (
                <CircularProgress size={30} className={classes.progress} />
              )}
              Follow
            </Button>
          ) : userHandle != createdBy && checkFollowed ? (
            <Button
              variant="contained"
              color="primary"
              className="follow-bottom"
              onClick={() => handleUnFollow(themeName)}
              disabled={loading}
            >
              {this.state.loadingFollow && (
                <CircularProgress size={30} className={classes.progress} />
              )}
              UnFollow
            </Button>
          ): null}
        </div>
      </Paper>
   
    )
    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  theme: state.data.theme,
  loading: state.UI.loading,
});

ThemeProfile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, { followTheme, unFollowTheme, deleteTheme })(
  withStyles(styles)(ThemeProfile)
);
