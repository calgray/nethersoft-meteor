
import React from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router';

class Home extends React.Component {

  render() {
    return (
      <div className="container">

        <Jumbotron id="blue-pcb">
          <h1>Nethersoft</h1>
        </Jumbotron>

        <h1>Homepage</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <h2>Checkout the old site</h2>
        <a href="http://nethersoft.herokuapp.com">nethersoft.herokuapp.com</a>
        <br/>
        <Link to="/about">About</Link>
      </div>
    );
  }

}

export default createContainer(() => {
  return {
    message: "Hello!"
  }
}, Home);
