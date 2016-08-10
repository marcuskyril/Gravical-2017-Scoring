var React = require('react');
var Abnormal = require('Abnormal');
var piSensorOverview = require('piSensorOverview');
var Uptime = require('Uptime');
var SensorHealthOverview = require('SensorHealthOverview');
var GeneralMetrics = require('GeneralMetrics');
var ErrorModal = require('ErrorModal');
var Tableaux = require('Tableaux');
var Notifications = require('Notifications');
var FontAwesome = require('react-fontawesome');
var BuildingOverview = require('BuildingOverview');
var AddSensorAPI = require('AddSensorAPI');
var {Link, IndexLink} = require('react-router');

class AddSensor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  onAddSensor(e) {
    e.preventDefault();

    var inputMac = this.refs.macAddress.value;
    var inputRegion = this.refs.region.value;
    var inputLocationLevel = this.refs.sensorLocationLevel.value;
    var inputLocationID = this.refs.sensorLocationID.value;
    var inputBuilding = this.refs.building.value;

    var that = this;

    AddSensorAPI.addSensor(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding).then(function(response){

      that.setState({
        message: response
      });

      //console.log("message", that.state.message);

      that.refs.macAddress.value = '';
      that.refs.region.value = '';
      that.refs.sensorLocationLevel.value = '';
      that.refs.sensorLocationID.value = '';
      that.refs.building.value = '';

    }, function(error) {
      alert(error);
    });
  }

  render() {
    var message = this.state.message;
    var that = this;
    //console.log("render", message);

    // resets message to empty string on close
    $('#add-sensor-modal').on('closed.zf.reveal', function() {
        //console.log("close");
        that.setState({
          message: ''
        });
    });

    return (
      <div id="add-sensor-modal" className="reveal tiny text-center" data-reveal="">
          <form>
              <div className="row">
                  <div className="large-12 columns">
                      <div className="header">Add Sensor</div>

                      <label>Mac Address
                          <input type="text" name="macAddress" ref="macAddress" placeholder="Mac Address" required/>
                      </label>
                      <label>Region
                          <select ref="region" name="region" required>
                              <option value=""></option>
                              <option value="north">North</option>
                              <option value="south">South</option>
                              <option value="east">East</option>
                              <option value="west">West</option>
                              <option value="central">Central</option>
                          </select>
                      </label>

                      <label>Sensor Location level
                          <input type="text" name="sensorLocationLevel" ref="sensorLocationLevel" placeholder="Sensor Location Level"/>
                      </label>

                      <label>Sensor Location ID
                          <input type="text" name="sensorLocationID" ref="sensorLocationID" placeholder="Sensor Location ID"/>
                      </label>

                      <label>Building
                          <input type="text" name="building" ref="building" placeholder="Building"/>
                      </label>
                      <div id="sensorMessage"><AddSensorMessage message={message}/></div>
                      <button className="button hollow expanded" onClick={this.onAddSensor.bind(this)}>
                          Add Sensor
                      </button>
                      <button className="button hollow expanded" data-close="">
                          Cancel
                      </button>
                  </div>
              </div>
          </form>
      </div>
    );
  }
}

class AddSensorMessage extends React.Component {
  render() {
    var message = this.props.message;
    console.log("message from parent: ", message);

    return (
      <div className="statusText">{message}</div>
    );
  }
}

var Dashboard = React.createClass({

    launchAddSensor: function() {
        var modal = new Foundation.Reveal($('#add-sensor-modal'));
        modal.open();
    },

    render: function() {

        console.log("Dashboard's overall data is: ", this.props.overall);
        console.log("Dashboard's notifications data is: ", this.props.notifications);
        console.log("Display name in dashboard:", this.props.userDisplayName);

        return (

            <div className="dashboard margin-top-md">
                <div className="row">
                  <div className="columns large-12">
                    <div className="sub-header">
                      Welcome, {this.props.displayName}
                    </div>
                    <div className="sub-header">
                       <Link to="/" activeClassName="active" activeStyle={{
                          color: '#222'
                      }}> View all notifications <FontAwesome name='caret-right'/></Link>
                    </div>
                    <div className="sub-header margin-bottom-small">
                      Last sync at {this.props.timestamp}
                      <FontAwesome name='refresh' spin style={{
                          textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', marginLeft: '0.5rem'
                      }}/>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="columns medium-3 large 3">
                      <BuildingOverview data={this.props.overall} />
                  </div>
                  <div className="columns medium-9">
                    <div>
                      <div className="callout callout-dark-header"><h4 className="header">Sensor Health Overview</h4>
                      <button onClick={this.launchAddSensor} className="icon-btn-text-small">
                        <FontAwesome name='plus-circle'/> ADD SENSOR
                      </button>
                      <AddSensor/>
                      </div>
                      <div className="callout callout-dark">
                        <GeneralMetrics data={this.props.bfg}/>
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


// <div className="columns medium-3">
//   <div className="callout callout-dark-header"><h4 className="header">Notifications</h4></div>
//     <Notifications data={this.props.notificationData}/>
// </div>
