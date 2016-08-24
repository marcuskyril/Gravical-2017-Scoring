var React = require('react');

class DeleteSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ''
    }
  }

  onDeleteSensor(macAddress) {
    e.preventDefault();
    var that = this;

    DeleteSensorAPI.deleteSensor(macAddress).then(function(response){

      that.setState({
        message: response
      });

    }, function(error) {
      alert(error);
    });
  }

  render() {
    var message = this.state.message;
    var that = this;
    //console.log("render", message);

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

                      <div className="header" style={{color: '#990000'}}>Nigga, do you really wanna delete this mah'fucker?</div>

                      <button className="button hollow expanded" onClick={this.onDeleteSensor.bind(this)}>
                          Yes I do
                      </button>
                      <button className="button hollow expanded" data-close="">
                          Slow down, cowboy
                      </button>
                  </div>
              </div>
          </form>
      </div>
    );
  }
}

module.exports = DeleteSensor;
