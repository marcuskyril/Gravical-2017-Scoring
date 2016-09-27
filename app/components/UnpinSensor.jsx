var React = require('react');
var updateWatchList = require('updateWatchList');
var unpinMac = "";
var {connect} = require('react-redux');
var store = require('configureStore').configure();

class UnpinSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  onUnpinSensor() {

    var macAdd = this.props.pin_mac.pin_mac;
    var that = this;

    updateWatchList.updateWatchList(macAdd, false).then(function (response) {
        console.log("removed sensor?", response);

        if (response.error) {
            that.setState({message: response.error});
        } else {
            that.setState({message: response.msg});
            $('#unpin-sensor-modal').foundation('close');
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
                      <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close" id="closeUnpin">Slow Down, Cowboy</a>
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
    console.log("state", state);
    return { pin_mac: state.pin_mac }
}

module.exports = connect(mapStateToProps)(UnpinSensor);
