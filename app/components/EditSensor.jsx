var React = require('react');
var editSensorAPI = require('editSensorAPI');
import * as Redux from 'react-redux';
import * as actions from 'actions';
var {connect} = require('react-redux');

class EditSensor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: ''
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {

        this.setState({
            [event.target.name]: event.target.value
        });
    }

    componentWillReceiveProps(props) {

        if(props.macAdd) {
            this.setState({
                macAdd: props.macAdd,
                port: props.port,
                region: props.region.toLowerCase(),
                building: props.building,
                level: props.level,
                areaID: props.areaID
            });
        }
    }

    onEditSensor(e) {

        e.preventDefault();

        var inputMac = this.refs.macAddress.value;
        var inputRegion = this.refs.region.value;
        var inputLocationLevel = this.refs.sensorLocationLevel.value;
        var inputLocationID = this.refs.sensorLocationID.value;
        var inputBuilding = this.refs.building.value;
        var inputPort = this.refs.port.value;
        var userId = this.props.userId;
        var {dispatch} = this.props;

        var that = this;

        editSensorAPI.editSensor(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding, inputPort).then(function(response) {

            if (response.error) {
                that.setState({message: response.error});
            } else {
                that.setState({message: response.success});

                var myCustomEvent = document.createEvent("Event");

                myCustomEvent.data = {
                    type: 'editSensor',
                    macAdd: inputMac,
                    building: inputBuilding,
                    location: `${inputLocationLevel}${inputLocationID}`
                };

                myCustomEvent.initEvent("customEvent", true, true);
                document.dispatchEvent(myCustomEvent);

                var actionDesc = `Edited ${inputMac} from ${inputBuilding} ${inputLocationLevel}${inputLocationID}`;
                dispatch(actions.startAddToLog(userId, actionDesc));
            }

            that.refs.macAddress.value = '';
            that.refs.port.value = '';
            that.refs.region.value = '';
            that.refs.sensorLocationLevel.value = '';
            that.refs.sensorLocationID.value = '';
            that.refs.building.value = '';
            that.refs.port.value = '';
        });
    }

    render() {
        var message = this.state.message;
        var {message, macAdd, building, level, areaID, port, region} = this.state;
        var that = this;

        $('#edit-sensor-modal').on('closed.zf.reveal', function() {
            that.setState({message: ''});
        });

        return (
            <div id="edit-sensor-modal" className="reveal medium" data-reveal="">
                <form>
                    <div className="row">
                        <div className="page-title" style={{
                            paddingLeft: '0.9375rem'
                        }}>Edit Sensor</div>

                        <div className="large-6 columns">
                            <label>Mac Address
                                <input type="text" name="macAdd" id="inputMac" ref="macAddress" placeholder="Mac Address" value={macAdd} onChange={this.handleChange} disabled/>
                            </label>

                            <label>Port
                                <input type="text" name="port" id="inputPort" ref="port" placeholder="Port" value={port} onChange={this.handleChange} />
                            </label>
                        </div>

                        <div className="large-6 columns" style={{
                            'borderLeft': 'solid 1px #e4e4e4'
                        }}>
                            <label>Region
                                <select ref="region" name="region" id="inputRegion" value={region} onChange={this.handleChange}  >
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
                                <input type="text" name="level" id="inputLocationLevel" ref="sensorLocationLevel" placeholder="Sensor Location Level" value={level} onChange={this.handleChange} />
                            </label>

                            <label>Sensor Location ID
                                <input type="text" name="areaID" id="inputSensorLocationID" ref="sensorLocationID" placeholder="Sensor Location ID" value={areaID} onChange={this.handleChange} />
                            </label>

                            <label>Building
                                <input type="text" name="building" id="inputBuildingName" ref="building" placeholder="Building" value={building} onChange={this.handleChange} />
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div id="sensorMessage"><EditSensorMessage message={message}/></div>
                        <a className="button proceed expanded" onClick={this.onEditSensor.bind(this)}>
                            Edit Sensor
                        </a>
                        <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close">
                            Cancel</a>
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

function mapStateToProps(state, ownProps) {
    return {sensorData: state.activeSensor, userId: state.syncData.userId}
}

module.exports = connect(mapStateToProps)(EditSensor);
