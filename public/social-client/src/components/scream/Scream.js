import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import MyButton from '../../util/myButton'
import ChatIcon from '@material-ui/icons/Chat'
import LikeButton from './LikeButton'
import DeleteScream from './DeleteScream'
import ScreamDialog from './ScreamDialog'
import EditScream from './EditScream';

const styles = ({
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
      },
      image: {
        minWidth: 200
      },
      content: {
        padding: 25,
        objectFit: 'cover'
      }
    })

class Scream extends Component {
   
    render() {
       
        dayjs.extend(relativeTime)
        const {classes, scream: {body,likeCount,commentCount,_id,owner,createdAt, themeName},user: {authenticated, credentials: {userHandle}}, themeData} = this.props
       
        let deleteButton = authenticated && (owner === userHandle || userHandle === (themeData && themeData.createdBy)) ? (
            <React.Fragment>
          <DeleteScream scream={this.props.scream} />
          {(owner === userHandle) && 
          <EditScream scream={this.props.scream} />}
          </React.Fragment>
        ) : null
        return (
            <Card className={classes.card}>
                <CardMedia
                className={classes.image}
                image={`/users/${owner}/avater`}
                title="Profile Image"
                />
                <CardContent className={classes.content}>
                {themeName && <Typography variant="h6" component={Link} to={`/themes/${themeName}`} color="secondary">{`#${themeName}`}</Typography>}
                    <Typography variant="h5" component={Link} to={`/users/${owner}`} color="primary">{`@${owner}`}</Typography>
                    {deleteButton}

                    <Typography variant="body2" color="textSecondary">{dayjs(createdAt).fromNow()}</Typography>
                    <Typography variant="body1" color="textSecondary">{body}</Typography>
                <LikeButton scream={this.props.scream} />
                <span>{likeCount} Likes</span>
                <MyButton tip="comments">
                    <ChatIcon color="primary" />
                </MyButton>
                <span>{commentCount} Comments</span>
                <ScreamDialog screamId={_id} userHandle={owner} openDialog={this.props.openDialog}/>

                </CardContent>
              
            </Card>
        )
    }
}

Scream.propTypes = {
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool
}

const mapStateToProps = state => ({
    user: state.user
});




export default connect(mapStateToProps)(withStyles(styles)(Scream))
