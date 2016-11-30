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

class EditSensor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            macAdd: '',
            port: '',
            region: '',
            building: '',
            level: '',
            areaID: '',
            warningCpuUsage: '',
            dangerCpuUsage: '',
            warningRamUsage: '',
            dangerRamUsage: '',
            warningDowntimePercentage: '',
            dangerDowntimePercentage: '',
            warningRiskUsage: '',
            dangerRiskUsage: '',
            warningTemperature: '',
            dangerTemperature: '',
            hasReceivedProps: false
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // console.log("event name", event.target.name);
        // console.log("event value", event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    componentDidMount() {

        var that = this;

        $('#edit-sensor-modal').on('closed.zf.reveal', function() {
            that.setState({
                hasReceivedProps: false,
                message: ''
            });
        });
    }

    componentWillReceiveProps(props) {

        var {hasReceivedProps} = this.state;

        if(!hasReceivedProps) {

            if(props.macAdd) {
                this.setState({
                    macAdd: props.macAdd,
                    port: props.port,
                    region: props.region.toLowerCase(),
                    building: props.building,
                    level: props.level,
                    areaID: props.areaID,
                    hasReceivedProps: true
                });

                if (props.thresholds) {
                    this.setState({
                        warningCpuUsage: props.thresholds.warning.cpu_usage,
                        dangerCpuUsage: props.thresholds.danger.cpu_usage,
                        warningRamUsage: props.thresholds.warning.ram_usage,
                        dangerRamUsage: props.thresholds.danger.ram_usage,
                        warningDowntimePercentage: props.thresholds.warning.downtime_percentage,
                        dangerDowntimePercentage: props.thresholds.danger.downtime_percentage,
                        warningRiskUsage: props.thresholds.warning.disk_usage,
                        dangerRiskUsage: props.thresholds.danger.disk_usage,
                        warningTemperature: props.thresholds.warning.temperature,
                        dangerTemperature: props.thresholds.danger.temperature,
                    });
                }
            }
        }
    }

    updateRegion() {

        var that = this;

        if ($('#isServer').prop('checked')) {
            that.refs.region.value = 'virtual';
        } else {
            that.refs.region.value = '';
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

        var {userEmail, dispatch} = this.props;

        console.log("userEmail edit", userEmail);

        var that = this;

        manageSensorAPI.editSensor(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding, inputPort, inputDangerDisk, inputDangerCPU, inputDangerRAM, inputDangerDTPercentage, inputDangerTemp, inputWarningDisk, inputWarningCPU, inputWarningRAM, inputWarningDTPercentage, inputWarningTemp).then(function(response) {

            if (response.error) {
                that.setState({message: response.error});
            } else {
                that.setState({message: response.success});

                var mytriggerNotification = document.createEvent("Event");

                mytriggerNotification.data = {
                    type: 'editSensor',
                    macAdd: inputMac,
                    building: inputBuilding,
                    location: `${inputLocationLevel}${inputLocationID}`
                };

                mytriggerNotification.initEvent("triggerNotification", true, true);
                document.dispatchEvent(mytriggerNotification);

                var actionDesc = `Edited ${inputMac} from ${inputBuilding} ${inputLocationLevel}${inputLocationID}`;
                dispatch(actions.startAddToLog(userEmail, actionDesc));
            }
        });
    }

    render() {

        // console.log("incoming!", this.state);

        var message = this.state.message;
        var {message, macAdd, building, level, areaID, port, region, warningCpuUsage, dangerCpuUsage, warningRamUsage,
            dangerRamUsage, warningDowntimePercentage, dangerDowntimePercentage, warningRiskUsage, dangerRiskUsage,
            warningTemperature, dangerTemperature} = this.state;
        var that = this;

        warningCpuUsage = (warningCpuUsage !== '') ? warningCpuUsage : DEFAULT_VAL.warning['cpuUsage'];
        dangerCpuUsage = (dangerCpuUsage !== '') ? dangerCpuUsage : DEFAULT_VAL.danger['cpuUsage'];
        warningRamUsage = (warningRamUsage !== '') ? warningRamUsage : DEFAULT_VAL.warning['ramUsage'];
        dangerRamUsage = (dangerRamUsage !== '') ? dangerRamUsage : DEFAULT_VAL.danger['ramUsage'];
        warningDowntimePercentage = (warningDowntimePercentage !== '') ? warningDowntimePercentage : DEFAULT_VAL.warning['downtimePercentage'];
        dangerDowntimePercentage = (dangerDowntimePercentage !== '') ? dangerDowntimePercentage : DEFAULT_VAL.danger['downtimePercentage'];
        warningRiskUsage = (warningRiskUsage !== '') ? warningRiskUsage : DEFAULT_VAL.warning['diskUsage'];
        dangerRiskUsage = (dangerRiskUsage !== '') ? dangerRiskUsage : DEFAULT_VAL.danger['diskUsage'];
        warningTemperature = (warningTemperature !== '') ? warningTemperature : DEFAULT_VAL.warning['temperature'];
        dangerTemperature = (dangerTemperature !== '') ? dangerTemperature : DEFAULT_VAL.danger['temperature'];


        // console.log("macAdd: ", macAdd);
        // console.log("building: ", building);
        // console.log("level: ", level);
        // console.log("areaID: ", areaID);
        // console.log("port: ", port);
        // console.log("region: ", region);

        return (
            <div id="edit-sensor-modal" className="reveal small" data-reveal="">
                <div className="page-title" style={{paddingBottom: '0.8rem'}}>Edit Sensor/Server</div>
                <form onSubmit={this.onEditSensor.bind(this)}>
                    <div className="row collapse">
                        <div className="medium-3 columns">
                            <ul className="tabs vertical" id="vert-tabs" data-tabs>
                                <li className="tabs-title is-active">
                                    <a href="#addPanelGerenal"  style={{color: 'black', fontSize: '1rem', fontWeight: '100'}}aria-selected="true">General</a>
                                </li>
                                <li className="tabs-title">
                                    <a href="#editPanelTreshold" style={{color: 'black', fontSize: '1rem', fontWeight: '100'}}>Thresholds</a>
                                </li>
                            </ul>
                        </div>
                        <div className="medium-9 columns" style={{minHeight: '22rem'}}>
                            <div className="tabs-content vertical" data-tabs-content="vert-tabs" style={{border: 'none'}}>
                                <div className="tabs-panel is-active" id="addPanelGerenal" style={{padding: 0}}>
                                    <table className="addEditSensor">
                                        <tbody>
                                            <tr style={{verticalAlign: 'top'}}>
                                                <td style={{padding: '0.5rem 1.0rem 0 1.5rem'}}>
                                                    <label>Mac Address
                                                        <input type="text" name="macAdd" ref="macAddress" placeholder="Mac Address" value={macAdd} onChange={this.handleChange} disabled/>
                                                    </label>

                                                    <fieldset>
                                                        <input id="isServer" ref="isServer" type="checkbox" onClick={this.updateRegion.bind(this)}/>
                                                        <label>Server?</label>

                                                        <div id="port">
                                                            <label>Port
                                                                <input type="number" name="port" id="inputPort" ref="port" value={port} onChange={this.handleChange} placeholder="Port"/>
                                                            </label>
                                                        </div>
                                                    </fieldset>
                                                </td>
                                                <td style={{padding: '0.5rem 1.5rem 0 1.0rem'}}>
                                                    <label>Region
                                                        <select name="region" ref="region" value={region} onChange={this.handleChange} required>
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
                                                        <input type="text" name="building" ref="building" placeholder="Building / Cluster Level" value={building} onChange={this.handleChange} required/>
                                                    </label>

                                                    <label>Building level / Group
                                                        <input type="text" name="level" ref="sensorLocationLevel" placeholder="Building / Group Level" value={level} onChange={this.handleChange} required/>
                                                    </label>

                                                    <label>Area / Server ID
                                                        <input type="text" name="areaID" ref="sensorLocationID" placeholder="Area / Server ID" value={areaID} onChange={this.handleChange} required/>
                                                    </label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                                <div className="tabs-panel" id="editPanelTreshold" style={{padding: 0}}>

                                    <table className="addEditSensor">
                                        <tbody style={{float: "left"}}>
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
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>CPU Usage (%)</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="100" step="0.01" name="warningCpuUsage" ref="warningCPU" placeholder="0" value={warningCpuUsage} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="100" step="0.01" name="dangerCpuUsage" ref="dangerCPU" placeholder="0" value={dangerCpuUsage} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#cc7a00'}}/>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>RAM Usage (%)</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" name="warningRamUsage" ref="warningRAM" placeholder="0" value={warningRamUsage} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" name="dangerRamUsage" ref="dangerRAM" placeholder="0" value={dangerRamUsage} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#cc7a00'}}/>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{backgroundColor: 'white'}}>
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>Downtime Percentage (%)</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" name="warningDowntimePercentage" ref="warningDTPercentage" placeholder="warningDowntimePercentage" value={warningDowntimePercentage} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" name="dangerDowntimePercentage" ref="dangerDTPercentage" placeholder="dangerDowntimePercentage" value={dangerDowntimePercentage} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#cc7a00'}}/>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{backgroundColor: 'white'}}>
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>Storage Usage (%)</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" name="warningRiskUsage" ref="warningDisk" placeholder="warningRiskUsage" value={warningRiskUsage} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="1" step="0.01" name="dangerRiskUsage" ref="dangerDisk" placeholder="dangerRiskUsage" value={dangerRiskUsage} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#cc7a00'}}/>
                                                        </label>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr style={{backgroundColor: 'white'}}>
                                                <td style={{textAlign: 'right'}}><label style={{fontSize: '1rem'}}>Temperature (&deg;C)</label></td>
                                                <td>
                                                    <div style={{margin: 'auto'}}>
                                                        <label style={{float: 'left', width: '50%'}}>
                                                            <input type="number" min="0" max="150" step="0.01" name="warningTemperature" ref="warningTemp" placeholder="warningTemperature" value={warningTemperature} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#ffcc00'}}/>
                                                        </label>
                                                        <label style={{float: 'right', width: '50%'}}>
                                                            <input type="number" min="0" max="150" step="0.01" name="dangerTemperature" ref="dangerTemp" placeholder="dangerTemperature" value={dangerTemperature} onChange={this.handleChange} required style={{margin: '0', textAlign: 'center',  borderColor: '#cc7a00'}}/>
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
                        <div id="sensorMessage"><EditSensorMessage message={message}/></div>
                        <input type="submit" value="Edit" className="button proceed expanded"/>
                        <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close">
                            Cancel
                        </a>
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
