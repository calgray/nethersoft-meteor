
import React from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

//import rd3 from 'react-d3';
import * as d3 from 'd3';

import NumericInput from 'react-numeric-input';
import NumberSpinner from '../extra/NumberSpinner/NumberSpinner';
import InputSpinner from '../extra/InputSpinner/InputSpinner';
import CheckBox from '../extra/CheckBox/CheckBox';
//import Test from '../extra/Test';

period = 2;

function* entries(obj) {
	for(let key of Object.keys(obj)) {
		yield [key, obj[key]];
	}
}

//Square Wave input
function* squareGenerator(p, dt) {
	var i = 0;

	while(true) {
		i = (i + 1) % (p / dt);

		if(i < (p / dt / 2)) yield 1;

		else yield -1;
	}
}
squareWave = squareGenerator(period, 0.02);


function clamp(min, max, v) {
	return Math.min(max, Math.max(min, v));
}

class PController {

}

class PIDController extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      running: false,
      n: 200, //n = 1/dt * total time
			dt: 0.02,
			inertia: 0.1,
			friction: 10.0,
			step: 0.01,
      settings: {
        "input": {
					magnitude: 1,
					period: 2,
					speed: 0,
        },
				"p": {
					power: 0,
					speed: 0,
				},
				"pi": {
					power: 0,
					speed: 0,
					ve1: 0,
				},
        "pid": {
					p: 1,
					i: 0,
					d: 0,
          power: 0,
          speed: 0,
					ve1: 0,
					ve2: 0,
        },
      },
      paths: { //these names are currently bound to div id
				"line-input": {
					"color": "blue",
					"strokeWidth": "2.0px",
					"data": [],
					"nextValue": 0,
					visible: true,
				},
				"line-p-power": {
					"color": "pink",
					"strokeWidth": "1.0px",
					"data": [],
					"nextValue": 0,
					visible: false,
				},
        "line-p": {
					"color": "red",
					"strokeWidth": "2.0px",
					"data": [],
					"nextValue": 0,
					visible: false,
				},
				"line-pi-power": {
					"color": "yellow",
					"strokeWidth": "1.0px",
					"data": [],
					"nextValue": 0,
					visible: false,
				},
				"line-pi": {
					"color": "orange",
					"strokeWidth": "2.0px",
					"data": [],
					"nextValue": 0,
				  visible: false,
				},
				"line-pid-power": {
					"color": "green",
					"strokeWidth": "1.0px",
					"data": [],
					"nextValue": 0,
					visible: true,
				},
				"line-pid": {
					"color": "green",
					"strokeWidth": "2.0px",
					"data": [],
					"nextValue": 0,
					visible: true,
				},
      },
    }

    //non-strict adapter
    let object = this;
    this.updateNonStrict = function () {
      object.update(this);
    };

    this.update = this.update.bind(this);
    this.startStop = this.startStop.bind(this);
		this.toggleLineVisibility = this.toggleLineVisibility.bind(this);
  }

	toggleLineVisibility(lineid) {

		let state = Object.assign(this.state);
		state.paths[lineid].visible = !this.state.paths[lineid].visible;
		this.setState(state);

		d3.select(`#${lineid}`)
			.style("visibility", state.paths[lineid].visible ? 'visible' : 'hidden');
	}

  componentDidMount() {
    this.setupGraph();
  }

	setupGraph() {
    let svg = d3.select("#main-plot");
    let margin = {top: 20, right: 20, bottom: 20, left: 40};


		let rect = svg.node().getBoundingClientRect();
		let width = Math.round(rect.right - rect.left - margin.left - margin.right);
		let height = Math.round(rect.bottom - rect.top - margin.top - margin.left);

    let x = d3.scaleLinear()
              .domain([0, this.state.n * this.state.dt])
              .range([0, width]);

    let y = d3.scaleLinear()
              .domain([-1.2, 1.2])
              .range([height, 0]);

    let line = d3.line()
              .x((d, i) => { return x(i * this.state.dt); })
              .y((d, i) => { return y(d); });

    let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    g.append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    //x axis ticks/markers
  	g.append("g")
  			.attr("class", "axis axis--x")
  			.attr("transform", "translate(0," + y(0) + ")")
  			.call(d3.axisBottom(x));

  	//y axis ticks/markers
  	g.append("g")
  			.attr("class", "axis axis--y")
  			.call(d3.axisLeft(y));


    //create the clipped lines
    for(let [key, value] of entries(this.state.paths)) {

			value.data = d3.range(this.state.n + 1)
											.map(() => { return 0; });

      g.append("g")
    			.attr("clip-path", "url(#clip)")
        .append("path")
    			.datum(value.data)
    			.attr("id", key)
    			.attr("class", "line")
					.attr("fill", "none")
    			.attr("stroke", value.color)
					.attr("stroke-width", value.strokeWidth)
					.attr("visibility", this.state.paths[key].visible ? 'visible' : 'hidden')
          .attr("d", line)
          .transition()
    				.duration(this.state.dt * 1000)
    				.ease(d3.easeLinear);
    }

    this.state.x = x;
    this.state.y = y;
    this.state.line = line;
    this.state.g = g;
  }

  startStop() {

    if(this.state.running) {
      $("#start").text("Start");
      this.state.running = false;
    }
    else {
      $("#start").text("Stop");
      this.state.running = true;

      //start all lines
			for(let [key, value] of entries(this.state.paths)) {
				d3.select(`#${key}`)
					.transition()
						.duration(50)
						.ease(d3.easeLinear)
						.on("start", this.updateNonStrict);
			}
		}
  }

  //could possibly move this to a controller class that can manage
  //its own state, data, and algorithm
  update(path) {
      if(this.state.running) {
        //append the current simulation values to the paths/dataline
        this.state.paths[path.id].data
					.push(this.state.paths[path.id].nextValue);

        //if user changes page during the wait, element will become null
        //and break what would otherwise be an endless loop.
        let element = $(`#${path.id}`)[0];
        if(element != null) {

          //update the line data
          d3.select(element)
            .attr("d", this.state.line)
            .attr("transform", null);

          //set the next transform
          d3.active(element)
            .attr("transform", "translate(" + this.state.x(-1 * this.state.dt) + ",0)")
            .transition()
              .duration(this.state.dt * 1000)
              .ease(d3.easeLinear)
              .on("start", this.updateNonStrict);

          this.state.paths[path.id].data
						.shift();

					//update simulation controllers in one hit here
          if(path.id === "line-input") {
            this.stepSimulation();
          }
        }
      }
  }

  stepSimulation() {

		//process using the previous frames input value
		let targetspeed = this.state.paths["line-input"].nextValue;

		this.state.paths["line-input"].nextValue = squareWave.next().value
			* this.state.settings["input"].magnitude;

    let friction = this.state.friction;
    let inertia = this.state.inertia;

    let kp = this.state.settings['pid'].p;
		let ki = this.state.settings['pid'].i;
		let kd = this.state.settings['pid'].d;

		//==== P Controller ==========
		let p_v = this.state.settings["p"].speed;
    let p_ve = targetspeed - p_v;

    let p_power = kp * p_ve;
    p_power = clamp(-1, 1, p_power);

		//physics
		p_v = p_v
		+ p_power / inertia * this.state.dt / 2
		- p_v * friction * this.state.dt / 2;

		//store simulation value
		this.state.settings["p"].power = p_power;
		this.state.settings["p"].speed = p_v;


		//set line values
		this.state.paths["line-p-power"].nextValue = this.state.settings["p"].power;
		this.state.paths["line-p"].nextValue = this.state.settings["p"].speed;




		//=========  PI controller ==============
		let pi_v = this.state.settings["pi"].speed;
		let pi_power_old = this.state.settings["pi"].power;

		let pi_ve = targetspeed - pi_v;
		let pi_ve1 = this.state.settings["pi"].ve1;

		let pi_power = pi_power_old
			+ (kp * (pi_ve - pi_ve1))
			+ (ki * (pi_ve + pi_ve1)/2);
		let pi_power_real = clamp(-1, 1, pi_power);


		//physics======================
		pi_v = pi_v
		+ pi_power_real / inertia * this.state.dt / 2
		- pi_v * friction * this.state.dt / 2;
		//===============================

		this.state.settings["pi"].power = pi_power;
		this.state.settings["pi"].speed = pi_v;
		this.state.settings["pi"].ve1 = pi_ve;


		this.state.paths["line-pi-power"].nextValue = pi_power_real;
		this.state.paths["line-pi"].nextValue = pi_v;


		//=========  PID controller ==============
		let pid_v = this.state.settings["pid"].speed;
		let pid_power_old = this.state.settings["pid"].power;

		let pid_ve = targetspeed - pid_v;
		let pid_ve1 = this.state.settings["pid"].ve1;
		let pid_ve2 = this.state.settings["pid"].ve2;

		let pid_power = pid_power_old
			+ (kp * (pid_ve - pid_ve1))
			+ (ki * (pid_ve + pid_ve1)/2)
			+ (kd * -(pid_ve - 2*pid_ve1 + pid_ve2));

		let pid_power_real = clamp(-1, 1, pid_power);


		//physics======================
		pid_v = pid_v
		+ pid_power_real / inertia * this.state.dt / 2
		- pid_v * friction * this.state.dt / 2;
		//===============================

		this.state.settings["pid"].power = pid_power;
		this.state.settings["pid"].speed = pid_v;
		this.state.settings["pid"].ve1 = pid_ve;
		this.state.settings["pid"].ve2 = pid_ve1;


		this.state.paths["line-pid-power"].nextValue = pid_power_real;
		this.state.paths["line-pid"].nextValue = pid_v;
  }

  render() {
    return (
      <div className="container">
        <h1>Speed Controller Simulation</h1>

				<div className="row">
					<div className="col-md-9">
	        	<svg id="main-plot" width="100%" height="500"></svg>
					</div>

          <div className="col-md-3">
						<div className="row">

							<div className="col-md-12">
								<div className="panel panel-default">
									<div className="panel-heading"><b>Simulation</b></div>
									<div className="panel-body">

										<button className="btn btn-default" id="start" onClick={this.startStop}>Start</button>

										<NumericInput
											className="form-control"
											value={this.state.step}
											step={0.01} precision={2}
											onChange={(v) => { this.setState({ step: v }); }}/>
									</div>
								</div>
							</div>

							<div className="col-md-12">
								<div className="panel panel-default">
									<div className="panel-heading"><b>Legend</b></div>
									<div className="panel-body">
										<CheckBox
											label="P Velocity"
											checked={this.state.paths["line-p"].visible}
											onChange={() => { this.toggleLineVisibility("line-p"); }}/>
										<CheckBox
											label="P Power"
											checked={this.state.paths["line-p-power"].visible}
											onChange={() => { this.toggleLineVisibility("line-p-power"); }}/>
										<CheckBox
											label="PI Velocity"
											checked={this.state.paths["line-pi"].visible}
											onChange={() => { this.toggleLineVisibility("line-pi"); } }/>
										<CheckBox
											label="PI Power"
											checked={this.state.paths["line-pi-power"].visible}
											onChange={() => { this.toggleLineVisibility("line-pi-power"); }}/>
										<CheckBox
											label="PID Velocity"
											checked={this.state.paths["line-pid"].visible}
											onChange={() => { this.toggleLineVisibility("line-pid"); } }/>
										<CheckBox
											label="PID Power"
											checked={this.state.paths["line-pid-power"].visible}
											onChange={() => { this.toggleLineVisibility("line-pid-power"); }}/>
									</div>
								</div>
							</div>
						</div>

          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
						<div className="panel panel-default">
							<div className="panel-heading"><b>Input Settings</b></div>
							<table className="table">
								<tbody>
									<tr>
										<th>Magnitude</th>
										<td>
											<NumericInput
												className="form-control"
												value={this.state.settings[`input`].magnitude}
												step={this.state.step} precision={2}
											  onChange={(v) => {this.state.settings[`input`].magnitude = v;}}/>
										</td>
									</tr>
									<tr>
										<th>Period</th>
										<td>
											<NumericInput
												className="form-control"
												value={this.state.settings[`input`].period}
												step={this.state.step} precision={2}
											  onChange={(v) => {period = v;}}/>
										</td>
									</tr>
								</tbody>
							</table>
	          </div>
					</div>

					<div className="col-md-4">
						<div className="panel panel-default">
							<div className="panel-heading"><b>Simulation Settings</b></div>
							<table className="table">
								<tbody>
									<tr>
										<th>Mass/Inertia</th>
										<td>
											<NumericInput
												className="form-control"
												value={this.state.inertia}
												step={this.state.step} precision={2} min={0.01}
											  onChange={(v) => {this.state.inertia = v;}}/>
										</td>
									</tr>
									<tr>
										<th>Friction</th>
										<td>
											<NumericInput
												className="form-control"
												value={this.state.friction}
												step={this.state.step} precision={2} min={0.01}
												onChange={(v) => {this.state.friction = v;}}/>
										</td>
									</tr>
									<tr>
										<th>Time Delta</th>
										<td>
											<NumericInput
												className="form-control"
												value={this.state.dt}
												step={this.state.step} precision={2}
												onChange={(v) => {this.state.dt = v;}}/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div className="col-md-4">
						<div className="panel panel-default">
							<div className="panel-heading"><b>PID Settings</b></div>
							<table className="table">
								<tbody>
									<tr>
										<th>P</th>
										<td>
											<NumericInput
												className="form-control"
												value={this.state.settings['pid'].p}
												step={this.state.step} precision={2}
											  onChange={(v) => {this.state.settings['pid'].p = v;}}/>
										</td>
									</tr>
									<tr>
										<th>I</th>
										<td>
											<NumericInput
												className="form-control"
												value={this.state.settings['pid'].i}
												step={this.state.step} precision={2}
											  onChange={(v) => {this.state.settings['pid'].i = v;}}/>
										</td>
									</tr>
									<tr>
										<th>D</th>
										<td>
											<NumericInput
												className="form-control"
												value={this.state.settings['pid'].d}
												step={this.state.step} precision={2}
											  onChange={(v) => {this.state.settings['pid'].d = v;}}/>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

        </div>

      </div>
    );
  }
}

PIDController.defaultProps = {

}

export default createContainer(() => {
  return { };
}, PIDController);
