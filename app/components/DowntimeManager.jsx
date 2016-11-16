var React = require('react');
var downtimeSchedulerAPI =require('downtimeSchedulerAPI');
var manageSensorAPI =require('manageSensorAPI');
var Select = require('react-select');
import * as Redux from 'react-redux';
import * as actions from 'actions';
var {connect} = require('react-redux');

class DowntimeManager extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            buildingList: [],
            sensorList: [],
            selectedBuilding: '',
            selectedSensors: []
        }

        this.buildingChange = this.buildingChange.bind(this);
    }

    componentDidMount() {

        var that = this;

        $('#downtime-manager-modal').on('closed.zf.reveal', function() {
            that.setState({
                hasReceivedProps: false,
                message: '',
                sensorList: [],
                selectedBuilding: '',
                selectedSensors: []
            });
        });

        downtimeSchedulerAPI.retrieveBuildings().then(function(response) {
            that.setState({
                buildingList: response
            });
        });
    }

    buildingChange(val) {
        // console.log("val", val);
        this.setState({selectedBuilding: val.value});
        this.retrieveSensors(val.value);
    }

    sensorChange(val) {
        // console.log("sensor change", val);
        this.setState({selectedSensors: val});
    }

    retrieveSensors(buildingName) {
        var that = this;
        var options = [];

        downtimeSchedulerAPI.retrieveSensors(buildingName).then(function(response) {
            response['all_sensors'].forEach(function(sensor) {
                var obj = {};

                obj['value'] = sensor['macAdd'];

                if(sensor['paused_status']) {
                    obj['label'] = `${sensor['location']}${sensor['areaId']} (PAUSED)`;
                } else {
                    obj['label'] = `${sensor['location']}${sensor['areaId']}`;
                }

                options.push(obj);
            });

            that.setState({
                sensorList: options
            });
        });
    }

    onEditSettings(shouldPause) {

        var userId = this.props.userId;
        var {dispatch} = this.props;
        var {selectedSensors, selectedBuilding} = this.state;

        var macAdds = [];
        var locations = [];

        if(selectedSensors.length >= 1) {
            selectedSensors.forEach(function(sensor) {
                macAdds.push(sensor.value);
                locations.push(sensor.label);
            });
        }

        var macAdds_str = macAdds.join();
        var locations_str = locations.join();
        var that = this;

        manageSensorAPI.pauseSensor(macAdds_str, shouldPause).then(function(response) {

            var errorMacs = [];
            var successMacs = [];

            var pauseTxt = shouldPause ? "Paused" : "Unpaused"

            response.forEach(function(entry) {
                if(entry.error) {
                    errorMacs.push(entry.macAdd);
                }

                if(entry.success) {
                    successMacs.push(entry.macAdd);
                }
            });

            if(errorMacs.length > 1) {

                var msg = `The following sensors are invalid: ${errorMacs.join()}`;

                that.setState({message: msg});

            } else if(response.error) {

                that.setState({message: response.error})

            } else {

                that.setState({message: `The following sensors were ${pauseTxt}: ${successMacs.join()}`});
                var myCustomEvent = document.createEvent("Event");

                myCustomEvent.data = {
                    type: 'downtimeManager',
                    macAdd: macAdds_str,
                    building: selectedBuilding,
                    location: locations_str
                };

                myCustomEvent.initEvent("customEvent", true, true);
                document.dispatchEvent(myCustomEvent);

                var actionDesc = `${pauseTxt} ${macAdds_str} from ${selectedBuilding} at the following locations: ${locations_str}`;
                dispatch(actions.startAddToLog(userId, actionDesc));
            }
        });
    }

    render() {
        var message = this.state.message;
        var {buildingList, sensorList, selectedBuilding, selectedSensors} = this.state;
        var that = this;

        return (
            <div id="downtime-manager-modal" className="reveal medium" data-reveal="">
                <form>
                    <div className="row">
                        <div className="page-title" style={{
                            paddingLeft: '0.9375rem'
                        }}>Downtime Manager</div>

                        <div className="large-12 columns">
                            <label>Buildings
                                <Select
                                    name="buildings"
                                    options={buildingList}
                                    value={selectedBuilding}
                                    onChange={this.buildingChange.bind(this)}
                                />
                            </label>

                            <label>Sensors
                                <Select
                                    name="sensorList"
                                    options={sensorList}
                                    value={selectedSensors}
                                    onChange={this.sensorChange.bind(this)}
                                    multi
                                />
                            </label>

                        </div>
                    </div>
                    <div className="row">
                        <div id="sensorMessage"><DowntimeManagerMessage message={message}/></div>
                        <a className="button proceed expanded" id="pauseBtn" onClick={this.onEditSettings.bind(this, true)}>
                            Pause Sensors
                        </a>
                        <a className="button proceed expanded" id="unpauseBtn" onClick={this.onEditSettings.bind(this, false)}>
                            Unpause Sensors
                        </a>
                        <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close">
                            Cancel</a>
                    </div>
                </form>
            </div>
        );
    }
}

class DowntimeManagerMessage extends React.Component {
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

module.exports = connect(mapStateToProps)(DowntimeManager);
