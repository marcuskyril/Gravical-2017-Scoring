var React = require('react');
var editSNMPSpeedTestAPI = require('editSNMPSpeedTestAPI');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import {connect} from 'react-redux';

class EditSNMPSpeedTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            macAdd: this.props.sensorData,
            interval: ''
        }
    }

    componentWillReceiveProps(props) {

        console.log("motherfucking props", props);
        // if(props.macAdd) {
        //     this.setState({
        //         macAdd: props.macAdd
        //     });
        // }
    }

    onEditSNMPSpeedTest(e) {
        // console.log("test type: ", this.props.type);

        e.preventDefault();

        var inputMac = this.refs.macAddress.value;
        var inputUsername = this.refs.inputUsername.value;
        var inputPassword = this.refs.inputPassword.value;
        var inputInterval = this.refs.inputInterval.value;

        var that = this;

        console.log("MAC", inputMac);
        console.log("username", inputUsername);
        console.log("password", inputPassword);
        console.log("interval", inputInterval);


        editSNMPSpeedTestAPI.editSNMPSpeedTest(inputMac, inputUsername, inputPassword, inputInterval).then(function(response) {

            if (response.error) {
                that.setState({message: response.error});
            } else {

                var myCustomEvent = document.createEvent("Event");

                myCustomEvent.data = {
                    type: 'editSNMPSpeedTest',
                    macAdd: inputMac,
                };

                myCustomEvent.initEvent("customEvent", true, true);
                document.dispatchEvent(myCustomEvent);

                that.setState({
                    message: response.success,
                    macAdd: inputMac,
                    interval: inputInterval
                });
            }
            //console.log("message", that.state.message);

            that.refs.macAddress.value = '';
            that.refs.inputUsername.value = '';
            that.refs.inputPassword.value = '';
            that.refs.inputInterval.value = '';
        });
    }

    render() {
        var {message, macAdd, interval} = this.state;

        console.log("macAdd", macAdd);

        var that = this;

        $('#edit-snmp-speedtest-modal').on('closed.zf.reveal', function() {
            that.setState({message: ''});
        });

        return (
            <div id="edit-snmp-speedtest-modal" className="reveal medium" data-reveal="">
                <form>
                    <div className="row">
                        <div className="page-title" style={{
                            paddingLeft: '0.9375rem'
                        }}>Edit SNMP Speed Test Settings</div>

                        <div className="large-12 columns">
                            <label>Mac Address
                                <input type="text" name="macAddress" ref="macAddress" placeholder="Mac Address" value={macAdd} disabled/>
                            </label>

                            <label>Username
                                <input type="text" name="username" ref="inputUsername" placeholder="Username"/>
                            </label>

                            <label>Password
                                <input type="password" name="password" ref="inputPassword" placeholder="Password"/>
                            </label>

                            <label>Interval
                                <select ref="inputInterval" name="interval" value={interval}>
                                    <option value="">Set Interval</option>
                                    <option value="5">5 mins</option>
                                    <option value="15">15 mins</option>
                                    <option value="30">30 mins</option>
                                    <option value="60">60 mins</option>
                                </select>
                            </label>

                            <div id="sensorMessage"><EditSNMPSpeedTestMessage message={message}/></div>
                            <a className="button proceed expanded" onClick={this.onEditSNMPSpeedTest.bind(this)}>
                                Edit
                            </a>
                            <a className="button cancel expanded close-reveal-modal" data-close="" aria-label="Close">
                                Cancel</a>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

class EditSNMPSpeedTestMessage extends React.Component {
    render() {
        var message = this.props.message;

        return (
            <div className="statusText">{message}</div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return { sensorData: state.macAdd }
}

module.exports = connect(mapStateToProps)(EditSNMPSpeedTest);
