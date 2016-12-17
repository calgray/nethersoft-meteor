

import React from 'react';
import ReactDOM from 'react-dom';

//http://bootsnipp.com/snippets/featured/bootstrap-number-spinner-on-click-hold
//http://codepen.io/bbrady/pen/ZprmVz
export default class NumberSpinner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numVal: this.props.numVal
    }

    this.handleDownClick = this.handleDownClick.bind(this);
    this.handleUpClick = this.handleUpClick.bind(this);
  }

  propagateStateChange(numVal) {

    numVal = Math.round(numVal * 100) / 100;

    if(this.state.numVal > -100 && this.state.numVal < 100) {
      this.setState({
        numVal: numVal
      }, () => {
        this.props.inputChanged(this.state.numVal);
      });
    }
  }

  handleDownClick() {

    this.propagateStateChange(this.state.numVal - this.props.delta);
  }

  handleUpClick() {
    this.propagateStateChange(this.state.numVal + this.props.delta);
  }

  render() {
    return (
      <div className="input-group number-spinner">

        <span className="input-group-btn">
          <button className="btn btn-default btn-info" onClick={this.handleDownClick}>
            <span className="glyphicon glyphicon-minus"></span>
          </button>
        </span>

        <input type="text" className="form-control text-center"
          //value={this.props.numVal}
          onSubmit={() => {console.log(`changed`);}}></input>

        <span className="input-group-btn">
          <button className="btn btn-default btn-info" onClick={this.handleUpClick}>
            <span className="glyphicon glyphicon-plus"></span>
          </button>
        </span>

      </div>
    );
  }
}

NumberSpinner.propTypes = {
  "numVal": React.PropTypes.number.isRequired,
  "inputChanged": React.PropTypes.func.isRequired
};

NumberSpinner.defaultProps = {
  "numVal": 0,
  "delta": 0.1,
  "inputChanged": (numVal) => {console.log(`new value : ${numVal}`);}
};
