var React = require('react');
var deleteSensorAPI = require('deleteSensorAPI');

class DeleteSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      macAddress: this.props.deleteMac
    }
  }

  onDeleteSensor(macAddress) {
    e.preventDefault();
    var that = this;

    deleteSensorAPI.deleteSensor(macAddress).then(function(response){

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
    var message = this.state.message;
    var that = this;

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
