import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

//React router helps create SPAs
import ReactRouter from 'react-router';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';


import '../imports/startup/accounts-config.js';

//Containers
import App from './containers/App.jsx';

//Components
import About from './components/pages/About.jsx';
import Home from './components/pages/Home.jsx';
import PIDController from './components/applets/PIDController.jsx';

Meteor.startup(() => {

  render((
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="about" component={About}/>
        <Route path="pidcontroller" component={PIDController}/>
      </Route>
    </Router>
  ), document.getElementById('render-target'));

  /*
  render((
    <App/>
  ), document.getElementById('render-target'));
  */
});
