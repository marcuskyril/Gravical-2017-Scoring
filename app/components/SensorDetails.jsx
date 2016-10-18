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
            building: '',
            macAdd: '',
            latency: '',
            amIAlive: '',
            location: '',
            status: '',
            lastReboot: '',
            stats: {},
            top5: []
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

                        that.setState({
                            macAdd: macAdd,
                            latency: latency,
                            building: response['building'],
                            amIAlive: response["am_i_alive"],
                            location: `${response["sensor_location_level"]}${response["sensor_location_id"]}`,
                            status: response["status"], // add class?
                            lastReboot: response["last_reboot"],
                            stats: {
                                uptime: `${response["uptime_percentage"]}%`,
                                temperature: `${response["temperature"]} C`,
                                cpu: `${response["cpu"]}%`,
                                storage: `${response["storage"]}%`,
                                ram: `${response["ram"]}%`,
                                flapping: response["flapping"]
                            },
                            top5: [
                                {process: response["top_5_processes"]["1"]["process"], usage: response["top_5_processes"]["1"]["usage"]},
                                {process: response["top_5_processes"]["2"]["process"], usage: response["top_5_processes"]["2"]["usage"]},
                                {process: response["top_5_processes"]["3"]["process"], usage: response["top_5_processes"]["3"]["usage"]},
                                {process: response["top_5_processes"]["4"]["process"], usage: response["top_5_processes"]["4"]["usage"]},
                                {process: response["top_5_processes"]["5"]["process"], usage: response["top_5_processes"]["5"]["usage"]}
                            ]
                        });

                    } else {
                        // no shit here
                        console.log("woah, nothing here buddy");
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

        var {macAdd, building, latency, amIAlive, status, location, lastReboot, stats, top5} = this.state;

        var location = `${building} ${location}`

        function renderStats(stats) {

            if(stats != undefined) {
                var rows = [];

                for(var key in stats) {
                    rows.push(
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{stats[key]}</td>
                        </tr>
                    );
                }

                return (
                    <tbody>
                        {rows}
                    </tbody>
                );
            }
        }

        function renderTop5(top5) {
            if(top5 != undefined) {
                var rows = [];
                for(var i = 0; i < top5.length; i++) {
                    rows.push(
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td>{top5[i]['process']}</td>
                            <td>{top5[i]['usage']}</td>
                        </tr>
                    );
                }

                return (
                    <tbody>
                        {rows}
                    </tbody>
                );
            }
        }

        return (
            <div>

                <div className="top-bar margin-bottom-small">
                    <div className="top-bar-left" style={{color: '#fff'}}>
                        {macAdd}
                    </div>
                    <div className="top-bar-right">
                        <ul className="dropdown menu" data-dropdown-menu>
                            <li>
                              <a><FontAwesome name='edit'/></a>
                            </li>
                            <li>
                              <a><FontAwesome name='trash'/></a>
                            </li>
                            <li>
                              <a><FontAwesome name='thumb-tack'/></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="textAlignCenter" style={{padding: '1.5rem'}}>
                    <div className="page-title">{location}</div>
                    <hr/>
                    <div>Data last collected at {lastReboot}</div>

                    <div className="page-title margin-top-md">Statistics</div>
                        <table className="sensor-details-table">
                            {renderStats(stats)}
                        </table>

                    <div className="page-title">Top 5 Processes</div>

                        <table className="sensor-details-table">
                            {renderTop5(top5)}
                        </table>


                    <a className="button proceed expanded">
                        Launch Terminal
                    </a>

                    <a className="button proceed expanded">
                        Reboot Sensor
                    </a>
                    <a className="button proceed expanded">
                        Historical Charts
                    </a>
                </div>
            </div>
        );
    }
};

function mapStateToProps(state, ownProps) {
    return {sensorData: state.activeSensor}
}

module.exports = connect(mapStateToProps)(SensorDetails);
