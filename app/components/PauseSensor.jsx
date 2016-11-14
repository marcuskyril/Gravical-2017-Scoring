var React = require('react');
var manageSensorAPI = require('manageSensorAPI');
import * as Redux from 'react-redux';
import * as actions from 'actions';
var {connect} = require('react-redux');

class PauseSensor extends React.Component {
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
                status: props.status,
                region: props.region.toLowerCase(),
                building: props.building,
                location: `${props.level}${props.areaID}`
            });
        }
    }

    onPauseSensor(event) {

        event.preventDefault();

        var {macAdd, location, building, status} = this.state;
        var {dispatch, userId} = this.props;
        var that = this;

        var isPaused = status === "paused" ? true : false;
        var pauseMsg = status === "paused" ? "Unpaused" : "Paused";

        manageSensorAPI.pauseSensor(macAdd, !isPaused).then(function(response) {

            console.log("status", response[0].success);

            if (response.error) {
                that.setState({message: response.error});
            } else {
                that.setState({message: response.success});

                var myCustomEvent = document.createEvent("Event");

                myCustomEvent.data = {
                    type: 'pauseSensor',
                    macAdd: macAdd,
                    building: building,
                    location: location,
                    pauseStatus: status === "paused" ? "unpausing" : "pausing"
                };

                myCustomEvent.initEvent("customEvent", true, true);
                document.dispatchEvent(myCustomEvent);
                var actionDesc = `${pauseMsg} ${macAdd} from ${building} ${location}`;

                dispatch(actions.startAddToLog(userId, actionDesc));
            }
        });
    }

    render() {
        var {message, macAdd, status} = this.state;
        var that = this;

        var pauseStatus = status === "paused" ? "Unpause" : "Pause";

        // resets message to empty string on close
        $('#pause-sensor-modal').on('closed.zf.reveal', function() {
            that.setState({message: ''});
        });

        return (
            <div id="pause-sensor-modal" className="reveal tiny text-center" data-reveal="">
                <form>
                    <div className="row">
                        <div className="large-12 columns">
                            <div className="page-title">{pauseStatus} Sensor</div>

                            <div className="header" style={{
                                color: '#990000'
                            }}>Hold up. You really wanna {pauseStatus} this bad boy?</div>
                            <div className="header" id="pauseDetails"></div>
                            <div className="header" id="pauseMac">{this.props.macAdd}</div>

                            <div id="pauseSensorMessage"><PauseSensorMessage message={message}/></div>

                            <a className="button proceed expanded" onClick={this.onPauseSensor.bind(this)}>
                                Yes I do
                            </a>
                            <a id="pauseClose" className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close">Slow Down, Cowboy</a>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

class PauseSensorMessage extends React.Component {
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

module.exports = connect(mapStateToProps)(PauseSensor);
