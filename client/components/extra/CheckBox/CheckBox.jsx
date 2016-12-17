import React from 'react';

export default class CheckBox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="checkbox">
        <label>
          <input type="checkbox"
            checked={this.props.checked}
            onChange={this.props.onChange}
            onClick={this.props.onClick}/>
            {this.props.label}
        </label>
      </div>
    );
  }
}

CheckBox.defaultProps = {
  label: "Test",
  checked: false,
  onChange: () => { console.log("onChange"); },
  onClick: () => { console.log("onClick"); },
}
