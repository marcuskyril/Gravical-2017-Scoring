var React = require('react');
var manageSensorAPI = require('manageSensorAPI');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import {connect} from 'react-redux';
var store = require('configureStore').configure();

class UnpinSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  onUnpinSensor() {

    var {dispatch, userId, userEmail} = this.props;
    var macAdd = this.props.pin_mac.pin_mac;
    var that = this;

    manageSensorAPI.updateWatchList(macAdd, false).then(function (response) {

        if (response.error) {
            that.setState({message: response.error});
        } else {

            var mytriggerNotification = document.createEvent("Event");

            mytriggerNotification.data = {
                type: 'unpinSensor',
                macAdd: macAdd
            };

            mytriggerNotification.initEvent("triggerNotification", true, true);
            document.dispatchEvent(mytriggerNotification);

            var testLog = `Unpinned ${macAdd} from the watch list`;
            dispatch(actions.startAddToLog(userEmail, testLog));

            console.log("response", response);

            that.setState({message: response.success});
        }
    });
  }

  render() {
    // console.log("delete sensor state ", this.state);
    var message = this.state.message;
    var that = this;

    // resets message to empty string on close
    $('#unpin-sensor-modal').on('closed.zf.reveal', function() {
        //console.log("close");
        that.setState({
          message: ''
        });
    });

    return (
      <div id="unpin-sensor-modal" className="reveal tiny text-center" data-reveal="">
          <form>
              <div className="row">
                  <div className="large-12 columns">
                      <div className="page-title">Unpin Sensor</div>

                      <div className="header" style={{color: '#990000'}}>Unpin this sensor, you want to?</div>
                      <input id="unpinMac" value="" hidden></input>

                      <div id="unpinSensorMessage"><UnpinSensorMessage message={message}/></div>

                      <a className="button proceed expanded" onClick={this.onUnpinSensor.bind(this)}>
                          Yes I do
                      </a>
                      <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close" id="closeUnpin">Cancel</a>
                  </div>
              </div>
          </form>
      </div>
    );
  }
}

class UnpinSensorMessage extends React.Component {
  render() {
    var message = this.props.message;

    return (
      <div className="statusText">{message}</div>
    );
  }
}

function mapStateToProps(state, ownProps) {
    return { pin_mac: state.pin_mac }
}

module.exports = connect(mapStateToProps)(UnpinSensor);
