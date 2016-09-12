var React = require('react');
var editSensorAPI = require('editSensorAPI');

class EditSensor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  onEditSensor(e) {
    // console.log("test type: ", this.props.type);

    e.preventDefault();

    var inputMac = this.refs.macAddress.value;
    var inputRegion = this.refs.region.value;
    var inputLocationLevel = this.refs.sensorLocationLevel.value;
    var inputLocationID = this.refs.sensorLocationID.value;
    var inputBuilding = this.refs.building.value;

    var that = this;

    editSensorAPI.editSensor(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding).then(function(response){

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
      that.refs.port.value = '';
      that.refs.region.value = '';
      that.refs.sensorLocationLevel.value = '';
      that.refs.sensorLocationID.value = '';
      that.refs.building.value = '';

    });
  }

  render() {
    var message = this.state.message;
    var that = this;

    $('#edit-sensor-modal').on('closed.zf.reveal', function() {
        that.setState({
          message: ''
        });
    });

    return (
      <div id="edit-sensor-modal" className="reveal medium" data-reveal="">
          <form>
              <div className="row">
                    <div className="header" style={{paddingLeft: '0.9375rem'}}>Add Sensor</div>

                    <div className="large-6 columns">
                      <label>Mac Address
                          <input type="text" name="macAddress" id="inputMac" ref="macAddress" placeholder="Mac Address" disabled/>
                      </label>

                      <label>Port
                          <input type="text" name="port" id="inputMac" ref="port" placeholder="Port"/>
                      </label>
                    </div>

                    <div className="large-6 columns" style={{'borderLeft':'solid 1px #e4e4e4'}}>
                      <label>Region
                          <select ref="region" name="region" id="inputRegion">
                              <option value=""></option>
                              <option value="north">North</option>
                              <option value="south">South</option>
                              <option value="east">East</option>
                              <option value="west">West</option>
                              <option value="central">Central</option>
                              <option value="virtual">Virtual</option>
                          </select>
                      </label>

                      <label>Sensor Location level
                          <input type="text" name="sensorLocationLevel" id="inputLocationLevel" ref="sensorLocationLevel" placeholder="Sensor Location Level"/>
                      </label>

                      <label>Sensor Location ID
                          <input type="text" name="sensorLocationID" id="inputSensorLocationID" ref="sensorLocationID" placeholder="Sensor Location ID"/>
                      </label>

                      <label>Building
                          <input type="text" name="building" id="inputBuildingName" ref="building" placeholder="Building"/>
                      </label>
                  </div>
              </div>
              <div className="row">
                <div id="sensorMessage"><EditSensorMessage message={message}/></div>
                <a className="button proceed expanded" onClick={this.onEditSensor.bind(this)}>
                    Edit Sensor
                </a>
                <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close"> Cancel</a>
              </div>
          </form>
      </div>
    );
  }
}

class EditSensorMessage extends React.Component {
  render() {
    var message = this.props.message;
    // console.log("message from parent: ", message);

    return (
      <div className="statusText">{message}</div>
    );
  }
}

module.exports = EditSensor;
