var React = require('react');
var manageSensorAPI = require('manageSensorAPI');
import * as Redux from 'react-redux';
import * as actions from 'actions';
var {connect} = require('react-redux');

class DeleteSensor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            macAdd: this.props.macAdd
        }
    }

    componentWillReceiveProps(props) {

        if(props.macAdd) {
            this.setState({
                macAdd: props.macAdd,
                port: props.port,
                region: props.region.toLowerCase(),
                building: props.building,
                location: `${props.level}${props.areaID}`
            });
        }
    }

    onDeleteSensor(event) {

        event.preventDefault();

        var {macAdd, location, building} = this.state;
        var {dispatch, userEmail} = this.props;
        var that = this;

        manageSensorAPI.deleteSensor(macAdd).then(function(response) {

            if (response.error) {
                that.setState({message: response.error});
            } else {
                that.setState({message: response.success});

                var mytriggerNotification = document.createEvent("Event");

                mytriggerNotification.data = {
                    type: 'deleteSensor',
                    macAdd: macAdd,
                    building: building,
                    location: location
                };

                $('#offCanvas').foundation('close', function(){
                    console.log("Closing canvas");
                });

                mytriggerNotification.initEvent("triggerNotification", true, true);
                document.dispatchEvent(mytriggerNotification);
                var actionDesc = `Deleted ${macAdd} from ${building} ${location}`;

                dispatch(actions.startAddToLog(userEmail, actionDesc));
            }
        });
    }

    render() {
        // console.log("delete sensor state ", this.state);
        var {message, macAdd} = this.state;
        var that = this;

        // resets message to empty string on close
        $('#delete-sensor-modal').on('closed.zf.reveal', function() {
            that.setState({message: ''});
        });

        return (
            <div id="delete-sensor-modal" className="reveal tiny text-center" data-reveal="">
                <form>
                    <div className="row">
                        <div className="large-12 columns">
                            <div className="page-title">Delete Sensor</div>

                            <div className="header" style={{
                                color: '#990000'
                            }}>Hold up. You really wanna delete this bad boy?</div>
                            <div className="header" id="deleteDetails"></div>
                            <div className="header" id="deleteMac">{this.props.macAdd}</div>

                            <div id="deleteSensorMessage"><DeleteSensorMessage message={message}/></div>

                            <a className="button proceed expanded" onClick={this.onDeleteSensor.bind(this)}>
                                Yes I do
                            </a>
                            <a id="deleteClose" className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close">Cancel</a>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

class DeleteSensorMessage extends React.Component {
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

module.exports = connect(mapStateToProps)(DeleteSensor);
