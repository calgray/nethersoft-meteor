
import React from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

class About extends React.Component {

  render() {
    return (
      <div className="container">
        <h2>About Page!</h2>
      </div>
    );
  }
}

export default createContainer(() => {
  return {

  };
}, About);
