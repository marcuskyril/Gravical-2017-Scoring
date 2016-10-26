var React = require('react');
var rebootSensorAPI = require('rebootSensorAPI');
var rebootMac = "";

class RebootSensor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      macAdd: ''
    }
  }

  componentWillReceiveProps(props) {
      var that = this;

      console.log("props", props);

      if(props.macAdd) {
          that.setState({macAdd: props.macAdd});
      }
  }

  onRebootSensor(event) {

    event.preventDefault();

    var username = this.refs.username.value;
    var password = this.refs.password.value;
    var {macAdd} = this.state;

    var that = this;

    rebootSensorAPI.rebootSensor(macAdd, username, password).then(function(response){

      if(response.error) {
        that.setState({
          message: response.error
        });
      } else {
        that.setState({
          message: response.msg
        });

        $('#closeReboot').click();
      }

      that.refs.username.value = '';
      that.refs.password.value = '';

    });
  }

  render() {
    // console.log("delete sensor state ", this.state);
    var {macAdd, message} = this.state;
    var that = this;

    // resets message to empty string on close
    $('#reboot-sensor-modal').on('closed.zf.reveal', function() {
        that.setState({
          message: ''
        });
    });

    return (
      <div id="reboot-sensor-modal" className="reveal tiny text-center" data-reveal="">
          <form>
              <div className="row">
                  <div className="large-12 columns">
                      <div className="page-title">Reboot Sensor</div>

                      <div className="header" style={{color: '#990000'}}>Hold up. You really wanna reboot this bad boy?</div>

                      <label>Username
                      <input type="text" ref="username" placeholder="Username" ></input>
                      </label>
                      <label>Password
                      <input type="password" ref="password" placeholder="Password" ></input>
                      </label>

                      <div id="rebootSensorMessage"><RebootSensorMessage message={message}/></div>

                      <a className="button proceed expanded" onClick={this.onRebootSensor.bind(this)}>
                          Yes I do
                      </a>
                      <a className="button cancel expanded close-reveal-modal" id="closeReboot" data-close="" aria-label="Close">Slow Down, Cowboy</a>
                  </div>
              </div>
          </form>
      </div>
    );
  }
}

class RebootSensorMessage extends React.Component {
  render() {
    var message = this.props.message;

    return (
      <div className="statusText">{message}</div>
    );
  }
}

module.exports = RebootSensor;
