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
        console.log(res.data.themes)
        this.setState({
            items: res.data.themes
        })
    })
    .catch(err => console.log(err))
 
    }
    handleOnSelect = (item) => {
        const { history } = this.props;
        if(history) history.push(`/themes/${item.themeName}`);
      }
    
  render() {
    console.log(this.props.location);
    const top100Films = [
        { name: 'The Shawshank Redemption', year: 1994 },
        { name: 'The Godfather', year: 1972 },
        { name: 'The Godfather: Part II', year: 1974 },
        { name: 'The Dark Knight', year: 2008 },
        { name: '12 Angry Men', year: 1957 },
        { name: "Schindler's List", year: 1993 }]
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
            fuseOptions={{ keys: ["themeName"] }}
            resultStringKeyName='themeName'
            placeholder={'Themes'}
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
