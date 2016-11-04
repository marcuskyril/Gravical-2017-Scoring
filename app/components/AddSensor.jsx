var React = require('react');
var addSensorAPI = require('addSensorAPI');
import * as Redux from 'react-redux';
import * as actions from 'actions';
var {connect} = require('react-redux');

const DEFAULT_VAL = {
    danger: {
        diskUsage: 0.9,
        cpuUsage: 60,
        ramUsage: 0.6,
        downtimePercentage: 0.6,
        temperature: 65,
    },

    warning: {
        diskUsage: 0.6,
        cpuUsage: 40,
        ramUsage: 0.4,
        downtimePercentage: 0.4,
        temperature: 60,
    }
};

class AddSensor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            danger: {
                diskUsage: 0.9,
                cpuUsage: 60,
                ramUsage: 0.6,
                downtimePercentage: 0.6,
                temperature: 65,
            },
            warning: {
                diskUsage: 0.6,
                cpuUsage: 40,
                ramUsage: 0.4,
                downtimePercentage: 0.4,
                temperature: 60,
            }
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    componentDidMount() {

        var that = this;

        $('#add-sensor-modal').on('closed.zf.reveal', function() {
            that.setState({
                message: '',
                danger: {
                    diskUsage: 0.9,
                    cpuUsage: 60,
                    ramUsage: 0.6,
                    downtimePercentage: 0.6,
                    temperature: 65,
                },
                warning: {
                    diskUsage: 0.6,
                    cpuUsage: 40,
                    ramUsage: 0.4,
                    downtimePercentage: 0.4,
                    temperature: 60,
                }
            });
        });
    }

    updateRegion() {

        var that = this;

        if ($('#isServer').prop('checked')) {
            that.refs.region.value = 'virtual';
        } else {
            that.refs.region.value = '';
        }
    }

    onAddSensor(e) {
        // console.log("test type: ", this.props.type);

        e.preventDefault();

        var inputMac = this.refs.macAddress.value;
        var inputRegion = this.refs.region.value;
        var inputLocationLevel = this.refs.sensorLocationLevel.value;
        var inputLocationID = this.refs.sensorLocationID.value;
        var inputBuilding = this.refs.building.value;
        var inputPort = this.refs.port.value;
        var isServer = this.refs.isServer.value;
        var userId = this.props.userId;

        var {dispatch} = this.props;
        var that = this;

        addSensorAPI.addSensor(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding, inputPort, isServer).then(function(response) {

            if (response.error) {
                that.setState({message: response.error});
            } else {
                that.setState({message: response.success});

                var myCustomEvent = document.createEvent("Event");

                myCustomEvent.data = {
                    type: 'addSensor',
                    macAdd: inputMac,
                    building: inputBuilding,
                    location: `${inputLocationLevel}${inputLocationID}`
                };

                myCustomEvent.initEvent("customEvent", true, true);
                document.dispatchEvent(myCustomEvent);

                var actionDesc = `Added ${inputMac} to ${inputBuilding} ${inputLocationLevel}${inputLocationID}`;
                dispatch(actions.startAddToLog(userId, actionDesc));

            }

            that.refs.macAddress.value = '';
            that.refs.port.value = '';
            that.refs.region.value = '';
            that.refs.sensorLocationLevel.value = '';
            that.refs.sensorLocationID.value = '';
            that.refs.building.value = '';
            that.refs.isServer.value = false;
        });
    }

    render() {
        var message = this.state.message;
        var that = this;


        return (
            <div id="add-sensor-modal" className="reveal large" data-reveal="">
                <form>
                    <div className="row">
                        <div className="page-title" style={{
                            paddingLeft: '0.9375rem'
                        }}>Add Sensor / Server</div>

                        <div className="large-4 columns">

                            <label>Mac Address
                                <input type="text" name="macAddress" ref="macAddress" placeholder="Mac Address"/>
                            </label>

                            <fieldset>
                                <input id="isServer" ref="isServer" type="checkbox" onClick={this.updateRegion.bind(this)}/>
                                <label>Server?</label>

                                <div id="port">
                                    <label>Port
                                        <input type="text" name="port" id="inputPort" ref="port" placeholder="Port"/>
                                    </label>
                                </div>
                            </fieldset>
                        </div>

                        <div className="large-4 columns" style={{
                            'borderLeft': 'solid 1px #e4e4e4'
                        }}>
                            <label>Region
                                <select ref="region" name="region">
                                    <option value=""></option>
                                    <option value="north">North</option>
                                    <option value="south">South</option>
                                    <option value="east">East</option>
                                    <option value="west">West</option>
                                    <option value="central">Central</option>
                                    <option value="virtual">Virtual</option>
                                </select>
                            </label>

                            <label>Building level / Group Level
                                <input type="text" name="sensorLocationLevel" ref="sensorLocationLevel" placeholder="Building / Group Level"/>
                            </label>

                            <label>Area / Server ID
                                <input type="text" name="sensorLocationID" ref="sensorLocationID" placeholder="Area / Server ID"/>
                            </label>

                            <label>Building / Cluster
                                <input type="text" name="building" ref="building" placeholder="Building / Cluster Level"/>
                            </label>
                        </div>
                        <div className="large-4 columns" style={{
                            'borderLeft': 'solid 1px #e4e4e4'
                        }}>
                            <div className="page-title">Customize Thresholds</div>

                            <div className="row">
                                CPU Usage
                                <div className="medium-6 columns">
                                    <label>Warning
                                        <input type="number" placeholder="0" defaultValue={this.state.warning['cpuUsage']}/>
                                    </label>
                                </div>
                                <div className="medium-6 columns">
                                    <label>Danger
                                        <input type="number" placeholder="0" defaultValue={this.state.danger['cpuUsage']}/>
                                    </label>
                                </div>
                             </div>
                            <div className="row">
                                RAM Usage
                                <div className="medium-6 columns">
                                    <label>Warning
                                        <input type="number" placeholder="0" defaultValue={this.state.warning['ramUsage']}/>
                                    </label>
                                </div>
                                <div className="medium-6 columns">
                                    <label>Danger
                                        <input type="number" placeholder="0" defaultValue={this.state.danger['ramUsage']}/>
                                    </label>
                                </div>
                             </div>
                            <div className="row">
                                Downtime Percentage
                                <div className="medium-6 columns">
                                    <label>Warning
                                        <input type="number" placeholder="0" defaultValue={this.state.warning['downtimePercentage']}/>
                                    </label>
                                </div>
                                <div className="medium-6 columns">
                                    <label>Danger
                                        <input type="number" placeholder="0" defaultValue={this.state.danger['downtimePercentage']}/>
                                    </label>
                                </div>
                             </div>
                            <div className="row">
                                Temperature
                                <div className="medium-6 columns">
                                    <label>Warning
                                        <input type="number" placeholder="0" defaultValue={this.state.warning['temperature']}/>
                                    </label>
                                </div>
                                <div className="medium-6 columns">
                                    <label>Danger
                                        <input type="number" placeholder="0" defaultValue={this.state.danger['temperature']}/>
                                    </label>
                                </div>
                             </div>
                        </div>
                    </div>
                    <div className="columns large-4">
                        <div id="sensorMessage"><AddSensorMessage message={message}/></div>
                        <a className="button proceed expanded" onClick={this.onAddSensor.bind(this)}>
                            Add Sensor
                        </a>
                        <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close">
                            Cancel
                        </a>
                    </div>

                </form>
            </div>
        );
    }
}

class AddSensorMessage extends React.Component {
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

module.exports = connect(mapStateToProps)(AddSensor);
