
import React from 'react';
import ReactDOM from 'react-dom';

export default class InputSpinner extends React.Component {

  componentDidMount() {
    //Cannot inject functions into jQuery at all here...
    //Component needs to be built without jquery dependency
    /*
    console.log("mounted");
    let id = "#" + this.props.id;
    let changed = this.changed();
    //$(function() {
      $(id).spinner('changed', function(e, newVal, oldVal) {
        changed();
      });
    //});
    */
  }

  changed() {
    console.log("changed!");
  }

  render() {

    return (
      <div className="input-group spinner" data-trigger="spinner" id={this.props.id}>

        <span className="input-group-addon">{this.props.label}</span>

        <input type="text" className="form-control text-center"
          //value={this.props.value}
          data-precision={this.props.data_precision}
          data-step={this.props.data_step}
          />

        <div className="input-group-addon">
  				<a className="spin-up"   href="javascript:;" data-spin="up"><i className="fa fa-caret-up"></i></a>
  				<a className="spin-down" href="javascript:;" data-spin="down"><i className="fa fa-caret-down"></i></a>
  			</div>

      </div>


    );
  }

}

InputSpinner.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.number.isRequired
};

InputSpinner.defaultProps = {
  "id": "spinner",
  "value": 0,
  "label": "spinner",
  "data_precision": 2,
  "data_step": 0.01
};
