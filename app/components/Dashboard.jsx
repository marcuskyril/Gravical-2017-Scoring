var React = require('react');
var Abnormal = require('Abnormal');
var piSensorOverview = require('piSensorOverview');
var Uptime = require('Uptime');
var SensorHealthOverview = require('SensorHealthOverview');
var SensorHealthOverviewV2 = require('SensorHealthOverviewV2');
var GeneralMetrics = require('GeneralMetrics');
var ErrorModal = require('ErrorModal');
var Tableaux = require('Tableaux');
var Notifications = require('Notifications');
var FontAwesome = require('react-fontawesome');
var BuildingOverview = require('BuildingOverview');
var AddSensor = require('AddSensor');
var DeleteSensor = require('DeleteSensor');
var {Link, IndexLink} = require('react-router');

var Dashboard = React.createClass({

    launchAddSensor: function() {
        var modal = new Foundation.Reveal($('#add-sensor-modal'));
        modal.open();
    },

    render: function() {

      console.log("overall dashboard: ", this.props.overall);
      console.log("bfg dashboard: ", this.props.bfg);
      console.log("notifications dashboard: ", this.props.notifications);
      console.log("sensorHealthOverviewV2 dashboard: ", this.props.sensorHealthOverviewV2);

        return (

            <div className="dashboard margin-top-md">
                <div className="row">
                  <div className="columns large-12">
                    <div className="callout-top-header margin-bottom-small">
                      <ul className="header-list">
                        <li>
                          <div className="sub-header">
                            Welcome, {this.props.displayName}
                          </div>
                        </li>
                        <li>
                          <div className="sub-header margin-bottom-small">
                            Last sync at {this.props.timestamp}
                            <FontAwesome name='refresh' spin style={{
                                textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', marginLeft: '0.5rem'
                            }}/>
                          </div>
                        </li>
                      </ul>

                      <ul className="header-list">
                        <li>
                          <div className="sub-header">
                             <Link to="/" activeClassName="active" activeStyle={{
                                color: '#222'
                            }}> View all notifications <FontAwesome name='caret-right'/></Link>
                          </div>
                        </li>
                        <li>
                          <div className="sub-header">
                             <Link to="/examples" activeClassName="active" activeStyle={{
                                color: '#222'
                            }}> View Sensor Log <FontAwesome name='caret-right'/></Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="columns medium-3 large 3 margin-bottom-small">
                      <BuildingOverview data={this.props.overall} />
                  </div>
                  <div className="columns medium-9 large 9">
                    <div>
                      <div className="callout callout-dark-header"><h4 className="header">Watch List</h4></div>
                      <div className="callout callout-dark">
                        <GeneralMetrics data={this.props.bfg}/>
                      </div>
                    </div>

                    <div>
                      <div className="callout callout-dark-header"><h4 className="header">Sensor Health Overview</h4>
                      <button onClick={this.launchAddSensor} className="icon-btn-text-small">
                        <FontAwesome name='plus-circle'/> ADD SENSOR
                      </button>
                      <AddSensor/>
                      <DeleteSensor/>
                      </div>
                      <div className="callout callout-dark scroll">
                        <SensorHealthOverviewV2 data={this.props.sensorHealthOverviewV2}/>
                      </div>
                    </div>

                    <div>
                      <div className="callout callout-dark-header"><h4 className="header">Abnormal Behaviour</h4></div>
                      <div className="callout callout-dark">
                      <Abnormal data={this.props.bfg}/>
                      </div>
                    </div>

                  </div>

                  <div className = "columns large-9">
                    <div className="callout callout-dark-header"><h4 className="header">All Sensors</h4></div>
                    <div className="callout callout-dark" id="bfg">
                      <Tableaux data={this.props.bfg}/>
                    </div>
                  </div>
                </div>
            </div>
        );
    }
});

module.exports = Dashboard;
