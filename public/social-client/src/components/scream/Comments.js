import React , { Component,Fragment} from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import dayjs from 'dayjs'
import DeleteComment from './DeleteComment'

import {connect} from 'react-redux'

const styles= theme => ({
    ...theme,
    commentImage: {
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%'
    },
    commentData: {
        marginLeft: 20
    }
})

class Comments extends Component {
    render(){
        const {comments,classes, scream: {owner},user: {authenticated, credentials: {userHandle}}} = this.props;
        return (
            <Grid container>
                {comments && comments.map((comment,index) =>  (
                    <Fragment key={comment.createdAt}>
                        {index !== 0 &&( <hr className={classes.invisibleSeparator} />)}
                        <Grid item sm={12}>
                            <Grid container>
                                <Grid item sm={2}>
                                    <img src={`/users/${comment.userHandle}/avater`} alt="comment" className={classes.commentImage} />
                                </Grid>
                                <Grid item sm={9}>
                                    <div className={classes.commentData}>
                                        <Typography
                                        variant="h5"
                                        componenet={Link}
                                        to={`/users/${comment.userHandle}`}
                                        color="primary" >
                                            {comment.userHandle}
                                        </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {dayjs(comment.createdAt).format('h:mm a, MMMM DD YYYY')}
                                    </Typography>
                                    <hr className={classes.invisibleSeparator} />
                                    <Typography variant="body1">{comment.body}</Typography>
                                    {(owner == userHandle) || (comment.userHandle == userHandle)&& authenticated ? <DeleteComment/>: null}
                                    
                                    </div>
                                </Grid>
                            </Grid>
                            
                        </Grid>
                        
                        {index !== comments.length - 1 &&( <hr className={classes.visibleSeparator} />)}
                       
                    </Fragment>
                ))}
       
                
            </Grid>
        )
    
    }
}

Comments.propTypes = {
    comments: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    
    classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user,
    scream: state.data.scream
});

export default connect(mapStateToProps)(withStyles(styles)(Comments))