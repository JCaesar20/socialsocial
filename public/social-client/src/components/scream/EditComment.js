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
import {editComment,clearErrors} from '../../redux/actions/dataActions';

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
    position: 'relative',
    left: '90%',
    bottom: '65px'
 }
})

class EditComment extends Component {

    state = {
        body: this.props.commentBody,
        id: this.props.id,
        screamId: this.props.screamId,
        open: false, 
        errors2: {}  
    }
    componentWillReceiveProps(nextProps) {
        
         console.log(nextProps)
        if(nextProps.errors) {
            this.setState({errors2: nextProps.errors})
        } 
        if(!nextProps.errors && !nextProps.loading){
            this.setState({
                open: false,
                errors2: {} 
            })
        }
    }

    handleOpen = () => {
        this.setState({open: true})
    }

    handleClose = () => {
        this.setState({open:false, errors2: {} })
        this.props.clearErrors();
    }

    handleChange = (event) => {
        this.setState({
        [event.target.name]:event.target.value
    })
    }
    handleSubmit = () => {
        const commentBody2 ={
            body: this.state.body
    }
        this.props.editComment(this.state.id, this.state.screamId, commentBody2);
    }

  render()  {
    /* const {} = this.state */
    const {classes,loading,errors} = this.props;
    console.log(errors)
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
                    <DialogTitle>Edit Your Comment</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                            name="body"
                            type="text"
                            label="Edit"
                            multiline
                            rows="3"
                            placeholder="Scream here!"
                            error={ errors && errors.error ? true: false} 
                            helperText={errors ? errors.error : ''}
                            className={classes.textField}
                            value={this.state.body}
                            onChange={this.handleChange}
                            fullWidth
                            />
                           
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSubmit} className={classes.submitButton} variant="contained" disabled={loading} color="primary">
                        Edit your Comment
                             {loading && (<CircularProgress size={30} className={classes.progressSpinner} />) }
                        </Button>
                    </DialogActions>
                </Dialog>
      </Fragment>
    );
  }
}




EditComment.propTypes = {
    editComment: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    loading: state.UI.loading,
    errors: state.UI.errors 
})

export default connect(mapStateToProps,{editComment,clearErrors})(withStyles(styles)(EditComment));