var React = require('react');
var manageSensorAPI = require('manageSensorAPI');
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
        // var isServer = this.refs.isServer.value;
        var inputDangerDisk = this.refs.dangerDisk.value;
        var inputDangerCPU = this.refs.dangerCPU.value;
        var inputDangerRAM = this.refs.dangerRAM.value;
        var inputDangerDTPercentage = this.refs.dangerDTPercentage.value;
        var inputDangerTemp = this.refs.dangerTemp.value;
        var inputWarningDisk = this.refs.warningDisk.value;
        var inputWarningCPU = this.refs.warningCPU.value;
        var inputWarningRAM = this.refs.warningRAM.value;
        var inputWarningDTPercentage = this.refs.warningDTPercentage.value;
        var inputWarningTemp = this.refs.warningTemp.value;

        var {dispatch, userId, userEmail} = this.props;
        var that = this;

        //===========================


        //===========================

        manageSensorAPI.addSensor(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding, inputPort, inputDangerDisk, inputDangerCPU, inputDangerRAM, inputDangerDTPercentage, inputDangerTemp, inputWarningDisk, inputWarningCPU, inputWarningRAM, inputWarningDTPercentage, inputWarningTemp).then(function(response) {

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
                dispatch(actions.startAddToLog(userEmail, actionDesc));

                that.refs.macAddress.value = '';
                that.refs.port.value = '';
                that.refs.region.value = '';
                that.refs.sensorLocationLevel.value = '';
                that.refs.sensorLocationID.value = '';
                that.refs.building.value = '';
                that.refs.isServer.value = false;
                that.refs.dangerDisk.value = DEFAULT_VAL.danger['diskUsage'];
                that.refs.dangerCPU.value = DEFAULT_VAL.danger['cpuUsage'];
                that.refs.dangerRAM.value = DEFAULT_VAL.danger['ramUsage'];
                that.refs.dangerDTPercentage.value = DEFAULT_VAL.danger['downtimePercentage'];
                that.refs.dangerTemp.value = DEFAULT_VAL.danger['temperature'];
                that.refs.warningDisk.value = DEFAULT_VAL.warning['diskUsage'];
                that.refs.warningCPU.value = DEFAULT_VAL.warning['cpuUsage'];
                that.refs.warningRAM.value = DEFAULT_VAL.warning['ramUsage'];
                that.refs.warningDTPercentage.value = DEFAULT_VAL.warning['downtimePercentage'];
                that.refs.warningTemp.value = DEFAULT_VAL.warning['temperature'];
            }

        });
    }

    render() {
        var message = this.state.message;
        var that = this;

        return (
            <div id="add-sensor-modal" className="reveal small" data-reveal="">
                <div className="page-title" style={{paddingBottom: '0.8rem'}}>Add Sensor/Server</div>
                <form onSubmit={this.onAddSensor.bind(this)}>
                    <div className="row collapse">
                        <div className="medium-3 columns">
                            <ul className="tabs vertical" id="vert-tabs" data-tabs>
                                <li className="tabs-title is-active">
                                    <a href="#panel1v"  style={{color: 'black', fontSize: '1rem', fontWeight: '100'}}aria-selected="true">General</a>
                                </li>
                                <li className="tabs-title">
                                    <a href="#panel2v" style={{color: 'black', fontSize: '1rem', fontWeight: '100'}}>Thresholds</a>
                                </li>
                            </ul>
                        </div>
                        <div className="medium-9 columns" style={{minHeight: '22rem'}}>
                            <div className="tabs-content vertical" data-tabs-content="vert-tabs" style={{border: 'none'}}>
                                <div className="tabs-panel is-active" id="panel1v" style={{padding: 0}}>
                                    <table className="addEditSensor">
                                        <tbody>
                                            <tr style={{verticalAlign: 'top'}}>
                                                <td style={{padding: '0.5rem 1.0rem 0 1.5rem'}}>
                                                    <label>Mac Address
                                                        <input type="text" name="macAddress" ref="macAddress" placeholder="Mac Address" required/>
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
                                                </td>
                                                <td style={{padding: '0.5rem 1.5rem 0 1.0rem'}}>
                                                    <label>Region
                                                        <select ref="region" name="region" required>
                                                            <option value=""></option>
                                                            <option value="north">North</option>
                                                            <option value="south">South</option>
                                                            <option value="east">East</option>
                                                            <option value="west">West</option>
                                                            <option value="central">Central</option>
                                                            <option value="virtual">Virtual</option>
                                                        </select>
                                                    </label>

                                                    <label>Building / Cluster
                                                        <input type="text" name="building" ref="building" placeholder="Building / Cluster Level" required/>
                                                    </label>

                                                    <label>Building level / Group
                                                        <input type="text" name="sensorLocationLevel" ref="sensorLocationLevel" placeholder="Building / Group Level" required/>
                                                    </label>

                                                    <label>Area / Server ID
                                                        <input type="text" name="sensorLocationID" ref="sensorLocationID" placeholder="Area / Server ID" required/>
                                                    </label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                <div className="tabs-panel" id="panel2v" style={{padding: 0}}>

                                    <table>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td style={{padding: '0.2rem', width: '23rem'}}>
                                                    <div style={{margin: 'auto'}}>
                                                    <label style={{float: 'left', width: '50%', textAlign: 'center', fontWeight: '100'}}>
                                                        Warning
                                                    </label>
                                                    <label style={{float: 'right', width: '50%', textAlign: 'center', fontWeight: '100'}}>
                                                        Danger
                                                    </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{backgroundColor: 'white'}}>
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>CPU Usage</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="100" step="0.01" ref="warningCPU" placeholder="0" defaultValue={this.state.warning['cpuUsage']} required style={{margin: '0', textAlign: 'center', borderRadius: '7px 0 0 7px', borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="100" step="0.01" ref="dangerCPU" placeholder="0" defaultValue={this.state.danger['cpuUsage']} required style={{margin: '0', textAlign: 'center', borderRadius: '0 7px 7px 0', borderColor: '#cc7a00'}}/>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>RAM Usage</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" ref="warningRAM" placeholder="0" defaultValue={this.state.warning['ramUsage']} required style={{margin: '0', textAlign: 'center', borderRadius: '7px 0 0 7px', borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" ref="dangerRAM" placeholder="0" defaultValue={this.state.danger['ramUsage']} required style={{margin: '0', textAlign: 'center', borderRadius: '0 7px 7px 0', borderColor: '#cc7a00'}}/>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{backgroundColor: 'white'}}>
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>Downtime Percentage</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" ref="warningDTPercentage" placeholder="0" defaultValue={this.state.warning['downtimePercentage']} required style={{margin: '0', textAlign: 'center', borderRadius: '7px 0 0 7px', borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" ref="dangerDTPercentage" placeholder="0" defaultValue={this.state.danger['downtimePercentage']} required style={{margin: '0', textAlign: 'center', borderRadius: '0 7px 7px 0', borderColor: '#cc7a00'}}/>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{backgroundColor: 'white'}}>
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>Storage Usage</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" ref="warningDisk" placeholder="0" defaultValue={this.state.warning['diskUsage']} required style={{margin: '0', textAlign: 'center', borderRadius: '7px 0 0 7px', borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" ref="dangerDisk" placeholder="0" defaultValue={this.state.danger['diskUsage']} required style={{margin: '0', textAlign: 'center', borderRadius: '0 7px 7px 0', borderColor: '#cc7a00'}}/>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{backgroundColor: 'white'}}>
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>Temperature</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="150" step="0.01" ref="warningTemp" placeholder="0" defaultValue={this.state.warning['temperature']} required style={{margin: '0', textAlign: 'center', borderRadius: '7px 0 0 7px', borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="150" step="0.01" ref="dangerTemp" placeholder="0" defaultValue={this.state.danger['temperature']} required style={{margin: '0', textAlign: 'center', borderRadius: '0 7px 7px 0', borderColor: '#cc7a00'}}/>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div id="sensorMessage"><AddSensorMessage message={message}/></div>
                        <input type="submit" value="Add" className="button proceed expanded"/>
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

        return (
            <div className="statusText">{message}</div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {sensorData: state.activeSensor, userId: state.syncData.userId}
}

module.exports = connect(mapStateToProps)(AddSensor);
