var React = require('react');
var axios = require('axios');
var FontAwesome = require('react-fontawesome');
var {connect} = require('react-redux');

var socket;
var colorMap = {
  "ok" : "#006600",
  "warning" : "#ffcc00",
  "danger" : "#cc7a00",
  "down" : "#990000",
  "no data" : "#737373"
}

class SensorDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            mac_address: '',
            building_name: '',
            building_level: '',
            area_id: '',
            CPU_usage: '',
            days: '',
            flapping: '',
            hours: '',
            last_reboot: '',
            mins: '',
            ram: '',
            status: '',
            storage: '',
            temperature: '',
            uptime_percentage: '',
            process1name: '',
            process1value: '',
            process2name: '',
            process2value: '',
            process3name: '',
            process3value: '',
            process4name: '',
            process4value: '',
            process5name: '',
            process5value: ''
        };
    }

    componentDidMount() {

        var that = this;

        const SOCKET_URL = "ws://opsdev.sence.io:9010/SensorStatus";

        window.addEventListener('tobascoSauce', function(e) {

            var macAdd = e.data.macAdd;
            console.log("From REDUX: ", macAdd);

            try {
                socket = new WebSocket(SOCKET_URL);

                socket.onopen = function(msg) {
                    console.log("connected");

                    that.send(macAdd);
                    // console.log("1st send");
                };

                socket.onmessage = function(msg) {

                    var response = JSON.parse(msg.data);
                    if (typeof response.error == "undefined") {
                        console.log("response", response);

                        // {response["am_i_alive"] ? colorMap['ok'] : colorMap['down']}
                        var latency = '';

                        if (response["router_latency"] != "-") {
                            latency = parseFloat(Math.round(response["router_latency"] * 100) / 100).toFixed(2);
                        }

                    } else {
                        // no shit here
                    }

                    setTimeout(function() {
                        that.send(macAdd);
                    }, 5000);

                };
                socket.onclose = function(msg) {
                    console.log("Disconnected");
                };

            } catch (ex) {
                console.warn(ex);
            }

        }, false);

        $(document).on('opened.zf.offcanvas', function(e) {
            var macAdd = that.props.sensorData.sensorData;

        });
    }

    send(msg) {
        // console.log("sent: " + msg);
        try {
            socket.send(msg);
            // console.log('Sent');
        } catch (ex) {
            console.warn(ex);
        }
    }

    quit() {
        if (socket != null) {
            log("Goodbye!");
            socket.close();
            socket = null;
        }
    }

    render() {
        // <div className="sub-header" id="mac_address"></div>
        // <div className="header" id="status"></div>
        // <div className="sub-header" id="itsDeadJim"></div>

        return (
            <div className="textAlignCenter">
                <div className="page-title" id="building">Loading</div>
                <hr/>
                <div id="last_reboot">loading...</div>

                <div className="page-title margin-top-md">Statistics</div>
                <table className="sensor-details-table">
                    <tbody>
                        <tr>
                            <td>Uptime</td>
                            <td id="uptime">-</td>
                            <td>%</td>
                        </tr>
                        <tr>
                            <td>Temperature</td>
                            <td id="temperature">-</td>
                            <td>&deg;C</td>
                        </tr>
                        <tr>
                            <td>CPU Usage</td>
                            <td id="cpu">-</td>
                            <td>%</td>
                        </tr>
                        <tr>
                            <td>Storage</td>
                            <td id="storage">-</td>
                            <td>%</td>
                        </tr>
                        <tr>
                            <td>RAM</td>
                            <td id="ram">-</td>
                            <td>%</td>
                        </tr>
                        <tr>
                            <td>Flapping</td>
                            <td id="flapping">-</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div className="top-5">
                    <div className="page-title">Top 5 Processes</div>
                    <table className="top-five-table">
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td id="top1"></td>
                                <td id="top1-usage"></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td id="top2"></td>
                                <td id="top2-usage"></td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td id="top3"></td>
                                <td id="top3-usage"></td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td id="top4"></td>
                                <td id="top4-usage"></td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td id="top5"></td>
                                <td id="top5-usage"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <a className="button proceed expanded">
                    Edit
                </a>
                <a className="button cancel expanded">
                    Delete
                </a>

                <a className="button proceed expanded">
                    Pin
                </a>

                <a className="button proceed expanded">
                    Cmd _>
                </a>

                <a className="button proceed expanded">
                    Reboot
                </a>
                <a className="button proceed expanded">
                    Charts
                </a>

            </div>
        );
    }
};

function mapStateToProps(state, ownProps) {
    return {sensorData: state.activeSensor}
}

module.exports = connect(mapStateToProps)(SensorDetails);
