var React = require('react');
var updateWatchList = require('updateWatchList');
var unpinMac = "";

class UnpinSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  onUnpinSensor() {

    var that = this;

    var macAddress = $('#unpinMac').val();

    updateWatchList.updateWatchList(macAddress, false).then(function (response) {
      console.log("removed sensor?", response);

      $('#closeUnpin').click();
    });
  }

  render() {
    // console.log("delete sensor state ", this.state);
    var message = this.state.message;
    var that = this;

    if ($('#unpinMac').val() !== "") {
        unpinMac = $('#unpinMac').val();
    }

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

module.exports = UnpinSensor;
