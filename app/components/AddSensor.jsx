var React = require('react');
var addSensorAPI = require('addSensorAPI');

class AddSensor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  onAddSensor(e) {
    console.log("test type: ", this.props.type);

    e.preventDefault();

    var inputMac = this.refs.macAddress.value;
    var inputRegion = this.refs.region.value;
    var inputLocationLevel = this.refs.sensorLocationLevel.value;
    var inputLocationID = this.refs.sensorLocationID.value;
    var inputBuilding = this.refs.building.value;

    var that = this;

    addSensorAPI.addSensor(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding).then(function(response){

      if(response.error) {
        that.setState({
          message: response.error
        });
      } else {
        that.setState({
          message: response.success
        });
      }
      //console.log("message", that.state.message);

      that.refs.macAddress.value = '';
      that.refs.region.value = '';
      that.refs.sensorLocationLevel.value = '';
      that.refs.sensorLocationID.value = '';
      that.refs.building.value = '';

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
                          <input type="text" name="macAddress" ref="macAddress" placeholder="Mac Address" noValidate/>
                      </label>
                      <label>Region
                          <select ref="region" name="region" noValidate>
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

module.exports = AddSensor;
