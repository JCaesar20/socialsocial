import React, {Fragment} from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles'
import dayjs from 'dayjs'
import {Link} from 'react-router-dom'
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import LinkIcon from "@material-ui/icons/Link";
import CalendarToday from "@material-ui/icons/CalendarToday";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
    ...theme
  })

const StaticProfile = (props) => {
    console.log(props)
    const { classes, profile: { userHandle, createdAt, avatar, bio, website  } }= props;
    const handle = props.user.credentials.userHandle;
    const authh = props.user.credentials.authenticated;
    console.log(handle, userHandle)
    return (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img
                src={`data:image/jpeg;base64,`+ avatar}
                alt="profile"
                className="profile-image"
              />
              
            </div>
            <hr />
            <div className="profile-details">
              <MuiLink
                component={Link}
                to={`/users/${userHandle}`}
                color="primary"
                variant="h5"
              >
                @{userHandle}
              </MuiLink>
              <hr />
              {bio && <Typography variant="body2">{bio}</Typography>}
              <hr />
              {website && (
                <Fragment>
                  <LinkIcon color="primary" />
                  <a href={website} targe="_blank" rel="noopener noreferrer">
                    {" "}
                    {website}
                  </a>
                  <hr />
                </Fragment>
              )}
              <CalendarToday color="primary" />{" "}
              <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
            </div>
          </div>
          <div style={{textAlign: 'center' , marginTop: '15px'}}> 
          {userHandle != handle ? <Button variant="contained"
              color="primary" className="follow-bottom">Follow
          </Button> : null }
          </div>
          
        </Paper>
    )
}
const mapStateToProps = (state) => ({
  user: state.user,
});
StaticProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,

}

export default connect(mapStateToProps, {}) (withStyles(styles)(StaticProfile))