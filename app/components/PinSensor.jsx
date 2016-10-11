var React = require('react');
var updateWatchList = require('updateWatchList');
var {connect} = require('react-redux');
var pinMac = "";

class PinSensor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ''
        }
    }

    onPinSensor() {

        var macAdd = this.props.pin_mac.pin_mac;
        var that = this;

        updateWatchList.updateWatchList(macAdd, true).then(function(response) {
            // console.log("Added sensor to watchlist", response);

            if (response.error) {
                that.setState({message: response.error});
            } else {

                var myCustomEvent = document.createEvent("Event");

                myCustomEvent.data = {
                    type: 'pinSensor',
                    macAdd: macAdd
                };

                myCustomEvent.initEvent("customEvent", true, true);
                document.dispatchEvent(myCustomEvent);

                that.setState({message: response.success});
            }
        });
    }

    render() {
        // console.log("delete sensor state ", this.state);
        var {message} = this.state;
        var that = this;

        // resets message to empty string on close
        $('#pin-sensor-modal').on('closed.zf.reveal', function() {
            //console.log("close");
            that.setState({message: ''});
        });

        return (
            <div id="pin-sensor-modal" className="reveal tiny text-center" data-reveal="">
                <form>
                    <div className="row">
                        <div className="large-12 columns">
                            <div className="page-title">Pin Sensor</div>

                            <div className="header" style={{
                                color: '#990000'
                            }}>Pin this sensor, you want to?</div>
                            <input id="pinMac" value="" hidden></input>

                            <div id="pinSensorMessage"><PinSensorMessage message={message}/></div>

                            <a className="button proceed expanded" onClick={this.onPinSensor.bind(this)}>
                                Yes I do
                            </a>
                            <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close" id="closePin">Slow Down, Cowboy</a>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

class PinSensorMessage extends React.Component {
    render() {

        var {message} = this.props;

        return (
            <div className="statusText">{message}</div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {pin_mac: state.pin_mac}
}

module.exports = connect(mapStateToProps)(PinSensor);
