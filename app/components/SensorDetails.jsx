var React = require('react');
var axios = require('axios');
var FontAwesome = require('react-fontawesome');
var socket;

class SensorDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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

        // TO DO:
        // Retrieve mac address from redux
        var macAddress = "B8:27:EB:05:B0:B0";

        try {
            socket = new WebSocket(SOCKET_URL);

            socket.onopen = function(msg) {
                console.log("connected");

                that.send(macAddress);
                // console.log("1st send");
            };
            socket.onmessage = function(msg) {

                var response = JSON.parse(msg.data);

                // console.log("response", response);

                setTimeout(function() {
                    that.send(macAddress);
                }, 5000);

            };
            socket.onclose = function(msg) {
                console.log("Disconnected");
            };

        } catch (ex) {
            console.warn(ex);
        }
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

module.exports = SensorDetails;
