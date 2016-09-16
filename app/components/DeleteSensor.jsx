var React = require('react');
var deleteSensorAPI = require('deleteSensorAPI');
var deleteMac = "";

class DeleteSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  onDeleteSensor(event) {

    event.preventDefault();
    // console.log("onDeleteSensor, ", $('#deleteMac').val());
    // var macAddress = $('#deleteMac').val();
    // console.log("To be deleted: ", macAddress);

    var that = this;

    deleteSensorAPI.deleteSensor(deleteMac).then(function(response){

      if(response.error) {
        that.setState({
          message: response.error
        });
      } else {
        that.setState({
          message: response.msg
        });
      }

    });
  }

  render() {
    // console.log("delete sensor state ", this.state);
    var message = this.state.message;
    var that = this;

    if ($('#deleteMac').val() !== "") {
        deleteMac = $('#deleteMac').val();
    }

    // resets message to empty string on close
    $('#delete-sensor-modal').on('closed.zf.reveal', function() {
        //console.log("close");
        that.setState({
          message: ''
        });
    });

    return (
      <div id="delete-sensor-modal" className="reveal tiny text-center" data-reveal="">
          <form>
              <div className="row">
                  <div className="large-12 columns">
                      <div className="header">Delete Sensor</div>

                      <div className="header" style={{color: '#990000'}}>Hold up. You really wanna delete this bad boy?</div>
                      <input id="deleteMac" value="" hidden></input>

                      <div id="deleteSensorMessage"><DeleteSensorMessage message={message}/></div>

                      <a className="button proceed expanded" onClick={this.onDeleteSensor.bind(this)}>
                          Yes I do
                      </a>
                      <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close">Slow Down, Cowboy</a>
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
    // console.log("message from parent: ", message);

    return (
      <div className="statusText">{message}</div>
    );
  }
}

module.exports = DeleteSensor;
