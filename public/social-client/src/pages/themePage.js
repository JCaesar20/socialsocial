import React, { Component } from 'react'
import PropTypes from 'prop-types';
import axios from 'axios';
import Scream from '../components/scream/Scream';
import ScreamSkeleton from '../util/ScreamSkeleton'
import ProfileSkeleton from '../util/ProfileSkeleton'
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { getUserData, getThemeData } from '../redux/actions/dataActions';
import ThemeProfile from '../components/profile/ThemeProfile'

class themePage extends Component {
    state = {
        themeData:null,
        screamIdParam: null
    } 
    componentDidMount() {
        const themeName = this.props.match.params.themeName;
        const screamId = this.props.match.params.screamId;
        console.log(themeName)
        if(screamId) this.setState({screamIdParam: screamId})

        this.props.getThemeData(themeName);


        axios.get(`/theme/${themeName}`)
            .then(res => {
                console.log(res.data.theme)
                this.setState({
                    themeData: res.data.theme
                })
            })
            .catch(err => {this.props.history.push('/errorTheme')})
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.match.params.themeName !== this.props.match.params.themeName) {
        const themeName = nextProps.match.params.themeName;
            
        this.props.getThemeData(themeName);
            axios.get(`/theme/${themeName}`)
            .then(res => {
                console.log(res.data.theme)
                this.setState({
                    themeData: res.data.theme
                })
            })
            .catch(err => console.log(err))
    }
        


     
        
    }


    render() {
        const {screams,loading,theme} = this.props.data;
        console.log(theme)
        const {screamIdParam} =this.state;
        const screamsMarkup = loading ? (
           <ScreamSkeleton />
        ) : screams.length === 0 ? (
            <p style={{color:'white'}}>No screams for this theme</p>
        ) : !screamIdParam ? (
            screams.map(scream => <Scream themeData={this.state.themeData} key={scream._id} scream={scream} />)
        ) : (
            screams.map(scream => {
                if(scream.screamId !== screamIdParam)
                    return <Scream themeData={this.state.themeData} key={scream.screamId} scream={scream} /> 
                else return <Scream themeData={this.state.themeData} key={scream.screamId} scream={scream} openDialog />
            })
        )
        console.log(screams)
        return (
            <Grid container spacing={16}>
                <Grid item sm={8} xs={12}>
                    {screamsMarkup}
                </Grid>
                <Grid item sm={4} xs={12}>
        { this.state.themeData ? <ThemeProfile history={this.props.history} themeData={this.state.themeData} />:<ProfileSkeleton /> }
                </Grid>
            </Grid>
        )
    }
}

themePage.propTypes = {
    getUserData: PropTypes.func.isRequired,
    getThemeData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    data: state.data,

})

export default connect(mapStateToProps,{getUserData, getThemeData})(themePage)