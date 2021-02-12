import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {likeScream, unlikeScream} from '../../redux/actions/dataActions'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'
import {connect} from 'react-redux'
import MyButton from '../../util/myButton'
import PropTypes from 'prop-types'

       


class LikeButton extends Component {
    likedScream = () => {
        if(this.props.user.likes && this.props.user.likes.find(like => like.screamID === this.props.scream._id))
            return true;
        else
            return false;
    }
    likeScream = () => {
        this.props.likeScream(this.props.scream._id)
    }
    unlikeScream = () => {
        this.props.unlikeScream(this.props.scream._id)
    }

    render() {
        const {user: {authenticated}} = this.props

        let likeButton = !authenticated? (
            <Link to="/login">
        <MyButton tip="like">
        <FavoriteBorder color="primary"/>
        </MyButton></Link>
)  : (this.likedScream() ? (
            <MyButton tip="unlike" onClick={this.unlikeScream}>
                <FavoriteIcon color="primary"/>  
            </MyButton>
        ): (
            <MyButton tip="like" onClick={this.likeScream}>
            <FavoriteBorder color="primary"/>  
            </MyButton>
        ));
        return (
           likeButton
        )
    }
}

LikeButton.propTypes = {
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user
});

const mapActionsToProps = {
    likeScream,
    unlikeScream
}


export default connect(mapStateToProps, mapActionsToProps)(LikeButton)



