import React from 'react';

//REDUX - TODO
//import { bindActionCreators } from 'redux';

// try to avoid using this
import ReactDOM from 'react-dom';
// react-meteor way, redux does different
import { createContainer } from 'meteor/react-meteor-data';

//APIs
// import { Tasks } from '../../lib/api/tasks.js';

//Components
import { Nav, NavItem, Navbar, NavDropdown, MenuItem, Link } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

import AccountsUI from '../components/meteor/AccountsUI';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  handleSelected(selectedKey) {
    //alert('selected ' + selectedKey);
  }

  render() {

    return (
      <div className="wrapper">
        <Navbar fixedTop>
            <div className="container">
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="/">Nethersoft</a>
                </Navbar.Brand>
                <Navbar.Toggle/>
              </Navbar.Header>
              <Nav bsStyle="pills" activeKey={1}>

              <IndexLinkContainer to='/'>
                <NavItem eventKey={1}>Home</NavItem>
              </IndexLinkContainer>

              <LinkContainer to='/articles'>
                <NavItem eventKey={2}>Articles</NavItem>
              </LinkContainer>

              <LinkContainer to='/about'>
                <NavItem eventKey={3}>About</NavItem>
              </LinkContainer>

              <NavDropdown eventKey={4} href="#" title="Applets" id="applets-dropdown">
                <LinkContainer to="/pidcontroller">
                  <MenuItem eventKey={4.1}>PID Controller</MenuItem>
                </LinkContainer>

                <MenuItem divider/>
                <MenuItem eventKey={4.2}>Another</MenuItem>
              </NavDropdown>
            </Nav>
            <Nav pullRight>

              {/*
              <NavItem>
                <AccountsUI/>
              </NavItem>
              */}
            </Nav>
          </div>
        </Navbar>

        <div className="container">
          <AccountsUI/>
        </div>

        <div className="content">
          {this.props.children}
        </div>

      </div>
    );
  }
}

export default createContainer(() => {
  //choose data/state to send at load time
  return { };

}, App);
