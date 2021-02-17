import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

import themeFile from "./util/theme";
import AuthRoute from "./util/AuthRoute";

import Cookies from "js-cookie";

import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_AUTHENTICATED } from "./redux/types";
import {getUserData} from './redux/actions/userActions'
import axios from 'axios'

import Navbar from "./components/layout/Navbar";

import home from "./pages/home";
import signup from "./pages/signup";
import login from "./pages/login";
import user from './pages/user';
import themePage from './pages/themePage'

import errorPage from './pages/dirtyRoute'
import errorTheme from './pages/dirtyRouteTheme'
import errorUser from './pages/dirtyRouteUser'

const theme = createMuiTheme(themeFile);

const token = localStorage.getItem("auth_token");
if (token) {
store.dispatch({type: SET_AUTHENTICATED})
axios.defaults.headers.common['Authorization'] = token;
store.dispatch(getUserData())
}

class App extends Component {
  render() {
    return (
      
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
            <Router>
              <Navbar />
              <div className="container">
                <Switch>
                  <Route exact path="/" component={home} />
                  <AuthRoute
                    exact
                    path="/signup"
                    component={signup}
                  />
                  <AuthRoute
                    exact
                    path="/login"
                    component={login}
                  />
                  <Route 
                  exact
                  path="/users/:handle"
                  component={user} 
                  />
                   <Route 
                  exact
                  path="/themes/:themeName"
                  component={themePage} 
                  />
                  <Route
                  exact
                  path="/users/:handle/scream/:screamId"
                  component={user}
                  />
                  <Route path='/errorUser' component={errorUser}/>
                  <Route path='/errorTheme' component={errorTheme}/>
                   <Route component={errorPage}/>

                </Switch>
              </div>
            </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
