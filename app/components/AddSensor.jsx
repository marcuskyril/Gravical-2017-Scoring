var React = require('react');
var manageSensorAPI = require('manageSensorAPI');
import * as Redux from 'react-redux';
import * as actions from 'actions';
var {connect} = require('react-redux');

class AddSensor extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        var that = this;

        $('#add-climber-modal').on('closed.zf.reveal', function() {
            that.setState({
                message: ''
            });
        });
    }

    onAddSensor(e) {
        
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

        var {dispatch, userEmail} = this.props;
        var that = this;

        manageSensorAPI.addSensor(inputMac, inputRegion, inputLocationLevel, inputLocationID, inputBuilding, inputPort, inputDangerDisk, inputDangerCPU, inputDangerRAM, inputDangerDTPercentage, inputDangerTemp, inputWarningDisk, inputWarningCPU, inputWarningRAM, inputWarningDTPercentage, inputWarningTemp).then(function(response) {

            if (response.error) {
                that.setState({message: response.error});
            } else {
                that.setState({message: response.success});

                var mytriggerNotification = document.createEvent("Event");

                mytriggerNotification.data = {
                    type: 'addSensor',
                    macAdd: inputMac,
                    building: inputBuilding,
                    location: `${inputLocationLevel}${inputLocationID}`
                };

                mytriggerNotification.initEvent("triggerNotification", true, true);
                document.dispatchEvent(mytriggerNotification);

                var actionDesc = `Added ${inputMac} to ${inputBuilding} ${inputLocationLevel}${inputLocationID}`;
                dispatch(actions.startAddToLog(userEmail, actionDesc));

                that.refs.macAddress.value = '';
                that.refs.port.value = '';
                that.refs.region.value = '';
                that.refs.sensorLocationLevel.value = '';
                that.refs.sensorLocationID.value = '';
                that.refs.building.value = '';
                that.refs.isServer.value = false;
            }

        });
    }

    render() {
        var message = this.state.message;
        var that = this;

        return (
            <div id="add-climber-modal" className="reveal small" data-reveal="">
                <div className="page-title" style={{paddingBottom: '0.8rem'}}>Add Sensor/Server</div>
                <form onSubmit={this.onAddSensor.bind(this)}>

                    Test
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
    return {sensorData: state.activeSensor}
}

module.exports = connect(mapStateToProps)(AddSensor);


// <div className="medium-9 columns" style={{minHeight: '22rem'}}>
//     <table className="addEditSensor">
//         <tbody>
//             <tr style={{verticalAlign: 'top'}}>
//                 <td style={{padding: '0.5rem 1.0rem 0 1.5rem'}}>
//                     <label>Mac Address
//                         <input type="text" name="macAddress" ref="macAddress" placeholder="Mac Address" required/>
//                     </label>
//
//                     <fieldset>
//                         <input id="isServer" ref="isServer" type="checkbox" onClick={this.updateRegion.bind(this)}/>
//                         <label>Server?</label>
//
//                         <div id="port">
//                             <label>Port
//                                 <input type="text" name="port" id="inputPort" ref="port" placeholder="Port"/>
//                             </label>
//                         </div>
//                     </fieldset>
//                 </td>
//                 <td style={{padding: '0.5rem 1.5rem 0 1.0rem'}}>
//                     <label>Region
//                         <select ref="region" name="region" required>
//                             <option value=""></option>
//                             <option value="north">North</option>
//                             <option value="south">South</option>
//                             <option value="east">East</option>
//                             <option value="west">West</option>
//                             <option value="central">Central</option>
//                             <option value="virtual">Virtual</option>
//                         </select>
//                     </label>
//
//                     <label>Building / Cluster
//                         <input type="text" name="building" ref="building" placeholder="Building / Cluster Level" required/>
//                     </label>
//
//                     <label>Building level / Group
//                         <input type="text" name="sensorLocationLevel" ref="sensorLocationLevel" placeholder="Building / Group Level" required/>
//                     </label>
//
//                     <label>Area / Server ID
//                         <input type="text" name="sensorLocationID" ref="sensorLocationID" placeholder="Area / Server ID" required/>
//                     </label>
//                 </td>
//             </tr>
//         </tbody>
//     </table>
// </div>
