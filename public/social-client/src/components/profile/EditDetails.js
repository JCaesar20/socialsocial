import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'

import ToolTip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";


import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MyButton from '../../util/myButton'

import { connect } from 'react-redux'
import {editUserDetails} from '../../redux/actions/userActions';

const styles = (theme) => ({
    ...theme,
    button:{
        float: 'right'
    }
})

class EditDetails extends Component {
    state= {
        bio: '',
        website: '',
        open: false
    };

    
   mapUserDetailsToState = (credentials) => {
    this.setState({
        bio: credentials.bio ? credentials.bio : '',
        website: credentials.website ? credentials.website : '' 
    }) 
   }
    componentDidMount() {
        const {credentials} = this.props
        this.mapUserDetailsToState(credentials)

    }

    handleOpen = () => {
        this.setState({open: true})
        const {credentials} = this.props
        this.mapUserDetailsToState(credentials)
    }

    handleClose = () => {
        this.setState({open:false})
    }

    handleChange = (event) => {
        this.setState({
        [event.target.name]:event.target.value
    })
    }

    handleSubmit = () => {
        const userDetails ={
            bio: this.state.bio,
            website: this.state.website
        }
        this.props.editUserDetails(userDetails)
        this.handleClose();
    }

    render() {
        const {classes} = this.props
        return (
            <Fragment>
                <MyButton tip="Edit Details" onClick={this.handleOpen} btnClassName={classes.button}>
                <EditIcon color="primary" />
              </MyButton>
                <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth
                maxWidth="sm">
                    <DialogTitle>Edit Your Details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                            name="bio"
                            type="text"
                            label="Bio"
                            multiline
                            rows="3"
                            placeholder="a short Bio about yourself"
                            className={classes.textField}
                            value={this.state.bio}
                            onChange={this.handleChange}
                            fullWidth
                            />
                            <TextField
                            name="website"
                            type="text"
                            label="website"
                            multiline
                            rows="3"
                            placeholder="your personal/professional website"
                            className={classes.textField}
                            value={this.state.website}
                            onChange={this.handleChange}
                            fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

EditDetails.propTypes = {
    editUserDetails: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const mapStateToProps =(state) => ({
    credentials:state.user.credentials
})

export default connect(mapStateToProps,{editUserDetails})(withStyles(styles)(EditDetails))
