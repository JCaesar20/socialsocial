import React, { Component } from 'react'
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Scream from '../components/scream/Scream'
import Profile from '../components/profile/Profile'
import ScreamSkeleton from '../util/ScreamSkeleton'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getScreams, getAuthScreams } from '../redux/actions/dataActions'

class home extends Component {
    
    state = {
        authenticated: this.props.user.authenticated
    }

    componentDidMount() {
        if(this.state.authenticated)
            this.props.getAuthScreams()
        else
            this.props.getScreams()
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if(this.props.user.authenticated !== nextProps.user.authenticated){
            if(nextProps.user.authenticated === true) {
                this.setState({authenticated: true})  
                this.props.getAuthScreams()

            }else {
                this.setState({authenticated: false})  
                this.props.getScreams()

            }
        }
    }

    
    render() {
        const {screams, loading} = this.props.data;
        let recentScreamsMarkup = !loading ? (screams && screams.map(scream => <Scream key={scream._id} scream={scream} />)):
        <ScreamSkeleton />;
        
        return (
            <Grid container spacing={16}>
                <Grid item sm={8} xs={12}>
                    {recentScreamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile />
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    getScreams: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data,
    user: state.user
})

export default connect(mapStateToProps, { getScreams, getAuthScreams })(home)  
