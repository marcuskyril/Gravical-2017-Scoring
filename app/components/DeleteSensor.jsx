var React = require('react');
var deleteSensorAPI = require('deleteSensorAPI');
var deleteMac = "";
var {connect} = require('react-redux');
var store = require('configureStore').configure();

class DeleteSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      deleteMac: store.getState().macAddress.macAddress
    }
  }

  onDeleteSensor(event) {

    event.preventDefault();

    var that = this;
    //var deleteMac = store.getState().macAddress;
    var macAdd = that.props.deleteMac.macAddress;

    deleteSensorAPI.deleteSensor(macAdd).then(function(response){

      if(response.error) {
        that.setState({
          message: response.error
        });
      } else {
        that.setState({
          message: response.msg
        });

        $('#delete-sensor-modal').foundation('close');
      }

    });
  }

  render() {
    // console.log("delete sensor state ", this.state);
    var message = this.state.message;
    var that = this;

    deleteMac = this.state.macAdd;

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
                      <div className="page-title">Delete Sensor</div>

                      <div className="header" style={{color: '#990000'}}>Hold up. You really wanna delete this bad boy?</div>
                      <div className="header" id="deleteDetails"></div>
                      <div className="header" id="deleteMac"></div>

                      <div id="deleteSensorMessage"><DeleteSensorMessage message={message}/></div>

                      <a className="button proceed expanded" onClick={this.onDeleteSensor.bind(this)}>
                          Yes I do
                      </a>
                      <a id="deleteClose" className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close">Slow Down, Cowboy</a>
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

function mapStateToProps(state, ownProps) {
    console.log("state", state);
    return { deleteMac: state.macAddress }
}

module.exports = connect(mapStateToProps)(DeleteSensor);
