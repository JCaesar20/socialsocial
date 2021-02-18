import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MyButton from "../../util/myButton";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import HomeIcon from "@material-ui/icons/Home";
import PostScream from "../scream/PostScream";
import Notifications from "./Notifications";
import CreateTheme from "../scream/CreateTheme";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Navbar extends Component {
state = {
    items: []
}
    componentDidMount(){

    axios.get(`/themes`)
    .then(res => {
        this.setState({
            items: res.data.arr
        })
    })
    .catch(err => console.log(err))
 
    }
    handleOnSelect = (item) => {
      console.log(item)
        const { history } = this.props;
        if(history&& item.themeName) history.push(`/themes/${item.themeName}`);
        else if(history&& item.userHandle) history.push(`/users/${item.userHandle}`);
      }
    
  render() {
    const { authenticated } = this.props;
    console.log(this.props.history)
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <PostScream />
              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon />
                </MyButton>
              </Link>
              <Notifications />
              <CreateTheme className="create-theme" />
              <div style={{ width: 155 }}>
              <ReactSearchAutocomplete
            items={this.state.items}
            onSelect={this.handleOnSelect}
            fuseOptions={{ keys: ["newHandle"] }}
            resultStringKeyName='newHandle'
            placeholder={'Search'}
          />
          </div>
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign up
              </Button>
            </Fragment>
          )}
        </Toolbar>
        
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default withRouter(connect(mapStateToProps)(Navbar));
