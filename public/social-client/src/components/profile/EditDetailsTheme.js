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
import {editTheme} from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme,
    button:{
        float: 'right'
    }
})

class EditDetailsTheme extends Component {
    state= {
        description: this.props.themeData.description,
        open: false
    };

    
   mapUserDetailsToState = (themeData) => {
    this.setState({
        description : themeData.description ? themeData.description : '', 
    }) 
   }
    componentDidMount() {
        const {themeData} = this.props
        this.mapUserDetailsToState(themeData)

    }

    handleOpen = () => {
        this.setState({open: true})
        const {themeData} = this.props
        this.mapUserDetailsToState(themeData)
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
        const themeDescription ={
            description: this.state.description
        }
        this.props.editTheme(themeDescription, this.props.themeData.themeName)
        this.props.func(this.state.description)
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
                    <DialogTitle>Edit Theme's Description</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                            name="description"
                            type="text"
                            label="Description"
                            multiline
                            rows="3"
                            placeholder="A short Description of the Theme"
                            className={classes.textField}
                            value={this.state.description}
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

EditDetailsTheme.propTypes = {
    classes: PropTypes.object.isRequired
}

const mapStateToProps =(state) => ({
    credentials:state.user.credentials
})

export default connect(mapStateToProps,{editTheme})(withStyles(styles)(EditDetailsTheme))
