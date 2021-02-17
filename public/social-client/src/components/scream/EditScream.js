import React, { Component,Fragment } from "react";

import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'



import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MyButton from '../../util/myButton'
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'
import {editScream,clearErrors} from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme,
    submitButton:{
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner : {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%'
    },
    
    
    editPos: {
        position: 'absolute !important',
        top: '10% !important',
        right: '8% !important',
        marginTop: 0
        } 
})

class EditScream extends Component {

    state = {
        body: this.props.scream.body,
        screamId: this.props.scream._id,
        open: false,
        errors: {}
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors})
        }
        if(!nextProps.errors && !nextProps.loading){
            this.setState({
                open: false,
                errors: {}
            })
        }
    }

    handleOpen = () => {
        this.setState({open: true})
    }

    handleClose = () => {
        this.setState({open:false,errors: {}})
        this.props.clearErrors();
    }

    handleChange = (event) => {
        this.setState({
        [event.target.name]:event.target.value
    })
    }
    handleSubmit = () => {
        this.props.editScream(this.state.screamId, {body : this.state.body});
    }

  render()  {
    const {errors} = this.state
    const {classes,loading} = this.props;
    return (
      <Fragment>
        <MyButton tip="Edit Scream" onClick={this.handleOpen} btnClassName={[classes.button, classes.editPos ].join(' ')}>
                    <EditIcon color="secondary" />
                </MyButton>
        <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullWidth
                maxWidth="sm">
                    <MyButton tip="close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButton>
                    <DialogTitle>Edit Your Scream</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                            name="body"
                            type="text"
                            label="Edit"
                            multiline
                            rows="3"
                            placeholder="Scream here!"
                            error={errors.error ? true: false}
                            helperText={errors.error}
                            className={classes.textField}
                            value={this.state.body}
                            onChange={this.handleChange}
                            fullWidth
                            />
                           
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSubmit} className={classes.submitButton} variant="contained" disabled={loading} color="primary">
                        Edit your Scream
                             {loading && (<CircularProgress size={30} className={classes.progressSpinner} />) }
                        </Button>
                    </DialogActions>
                </Dialog>
      </Fragment>
    );
  }
}




EditScream.propTypes = {
    editScream: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    loading: state.UI.loading,
    errors: state.UI.errors 
})

export default connect(mapStateToProps,{editScream,clearErrors})(withStyles(styles)(EditScream));