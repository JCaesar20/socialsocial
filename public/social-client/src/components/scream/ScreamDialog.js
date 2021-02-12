import React , { Component,Fragment} from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import MyButton from '../../util/myButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import dayjs from 'dayjs'
import {Link} from 'react-router-dom'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import UnfoldMore from '@material-ui/icons/UnfoldMore'
import ChatIcon from '@material-ui/icons/Chat'

import {connect} from 'react-redux'
import {getScream, clearErrors} from '../../redux/actions/dataActions'
import LikeButton from './LikeButton'
import Comments from './Comments'
import CommentForm from './CommentForm'


const styles= theme => ({
...theme,
profileImage: {
    maxWidth: 200,
    height: 200,
    borderRadius: '50%',
    objectFit: 'cover'
},
dialogContent: {
    padding:20
},
closeButton: {
    position: 'absolute',
    left: '90%'
}, 
expandButton: {
    position: 'absolute',
    left:'90%'

},
spinnerDiv: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50 
}
})

class ScreamDialog extends Component {
    state= {
        open: false,
        oldPath: '',
        newPath: ''
    }

    componentDidMount() {
        if(this.props.openDialog) {
            this.handleOpen()
        }
    }

    handleOpen = () => {
        let oldPath = window.location.pathname;
        const {userHandle, screamId} = this.props;
        const newPath = `/users/${userHandle}/scream/${screamId}`
        if(oldPath === newPath) oldPath = `/users/${userHandle}`
        window.history.pushState(null,null,newPath);
        this.setState({open: true, oldPath, newPath})
        this.props.getScream(this.props.screamId)
    }

    handleClose = () => {
        window.history.pushState(null,null,this.state.oldPath)
        this.setState({open:false})
        this.props.clearErrors()
    }

    render(){
        const {classes,scream: {body,likeCount,commentCount,_id,owner,createdAt,comments}, UI: {loading}} = this.props
        const dialogMarkup = loading ? (
           <div className={classes.spinnerDiv}>
            <CircularProgress size={200} />
            </div>
        ) : (
            <Grid container spacing={16}>
                <Grid item sm={5}>
                    <img src={`/users/${owner}/avater`} alt="Profilepicture" className={classes.profileImage} />
                </Grid> 
                <Grid item sm={7}>
                    <Typography
                    component={Link}
                    color="primary"
                    variant="h5"
                    to={`/user/${owner}`}>
                        @{owner}
                    </Typography>
                    <hr className={classes.invisibleSeparater} />
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                    </Typography>
                    <hr className={classes.invisibleSeparater} />
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    <LikeButton scream={this.props.scream} />
                <span>{likeCount} Likes</span>
                <MyButton tip="comments">
                    <ChatIcon color="primary" />
                </MyButton>
                <span>{commentCount} Comments</span>
                </Grid> 
                <hr className={classes.invisibleSeperator} />
                <CommentForm screamId={_id} />
                <Comments comments={comments} /> 
            </Grid>
        )
        return (
            <Fragment>
              <MyButton tip="Expand Scream" onClick={this.handleOpen} btnClassName={classes.expandButton}>
                <UnfoldMore color="primary" />
              </MyButton>
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth
                maxWidth="sm">
                    <MyButton tip="close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogContent className={classes.dialogContent}>
                 {dialogMarkup}
                    </DialogContent>
                    
                </Dialog>
            </Fragment>
        )
    }

}

ScreamDialog.propTypes = {
    getScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    scream: PropTypes.object.isRequired,
    userHandle: PropTypes.string.isRequired,
    UI: PropTypes.object.isRequired
}

const mapStateToProps = state =>({
    scream:state.data.scream,
    UI: state.UI,
    user: state.user
})

export default connect(mapStateToProps,{getScream,clearErrors})(withStyles(styles)(ScreamDialog))