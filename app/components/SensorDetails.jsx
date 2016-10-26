var React = require('react');
var axios = require('axios');
var DeleteSensor = require('DeleteSensor');
var PinSensor = require('PinSensor');
var EditSensor = require('EditSensor');
var RebootSensor = require('RebootSensor');
var Terminal = require('Terminal');
var FontAwesome = require('react-fontawesome');
var {Link, IndexLink} = require('react-router');

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
            building: '-',
            macAdd: '',
            latency: '-',
            amIAlive: false,
            location: '-',
            status: '-',
            lastReboot: '-',
            stats: {},
            top5: []
        };
    }

    componentDidMount() {

        var that = this;

        const SOCKET_URL = "ws://opsdev.sence.io:9010/SensorStatus";

        window.addEventListener('tobascoSauce', function(e) {

            var macAdd = e.data.macAdd;
            console.log("Off-canvas mac address: ", macAdd);

            try {
                socket = new WebSocket(SOCKET_URL);

                socket.onopen = function(msg) {
                    console.log("connected");
                    that.send(macAdd);
                };

                socket.onmessage = function(msg) {

                    var response = JSON.parse(msg.data);

                    // console.log("response", response);

                    if (response.error !== "no data") {
                        console.log("response", response);
                        var latency = '';

                        if (response["router_latency"] != "-") {
                            latency = parseFloat(Math.round(response["router_latency"] * 100) / 100).toFixed(2);
                        }

                        console.log("responsewatchlist", response["watchlist"]);

                        if(response["watchlist"]) {
                            $('#top-bar-pin').addClass('button-disabled');
                        } else {
                            $('#top-bar-pin').removeClass('button-disabled');
                        }

                        that.setState({
                            macAdd: macAdd,
                            latency: latency,
                            port: response["port"],
                            region: response["geo_region"],
                            building: response['building'],
                            amIAlive: response["am_i_alive"],
                            level: response["sensor_location_level"],
                            areaID: response["sensor_location_id"],
                            location: `${response["sensor_location_level"]}${response["sensor_location_id"]}`,
                            status: response["status"],
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
                        that.setState({
                            macAdd: macAdd,
                            building: response['building'],
                            amIAlive: response["am_i_alive"],
                            region: response["geo_region"],
                            level: response["sensor_location_level"],
                            areaID: response["sensor_location_id"],
                            location: `${response["sensor_location_level"]}${response["sensor_location_id"]}`
                        });
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


        $(document).on('closed.zf.offcanvas', function() {
            that.quit();
        });

    }

    send(msg) {
        if(socket != null) {
            try {
                socket.send(msg);
            } catch (ex) {
                console.warn(ex);
            }
        }
    }

    quit() {

        if (socket != null) {
            console.log("Ciao bella.");
            socket.close();
            socket = null;
        }
    }

    handleClick(type) {

        switch(type) {
            case 'delete':
                $('#delete-sensor-modal').foundation('open');
                //dispatch(actions.startUpdateWatchList(macAddress));
                break;

            case 'pin':
                $('#pin-sensor-modal').foundation('open');
                //dispatch(actions.startUpdateWatchList(macAddress));
                break;

            case 'edit':
                $('#edit-sensor-modal').foundation('open');
                //dispatch(actions.startUpdateWatchList(macAddress));
                break;
            case 'terminal':
                $('#terminal').foundation('open');
                break;
            case 'reboot':
                $('#reboot-sensor-modal').foundation('open');
                break;
        }
    }

    render() {

        var {macAdd, building, latency, amIAlive, port, status, location, lastReboot, stats, top5} = this.state;
        var location = `${building} ${location}`
        var amIAliveColor = amIAlive ? "green" : colorMap['down'];

        var historicalLink = `/historical/${macAdd}`


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
                    <div className="top-bar-left" style={{color: '#fff',marginTop:'1rem',fontWeight:'bold'}}>
                        {location}
                    </div>
                    <div className="top-bar-left" style={{color: '#fff',position:'absolute',top:'14px',fontSize:'0.75rem'}}>
                        {macAdd}
                    </div>
                    <div className="top-bar-right">
                        <ul className="dropdown menu" data-dropdown-menu>
                            <li>
                              <a id="top-bar-edit" onClick={this.handleClick.bind(this, 'edit')}><FontAwesome name='edit'/></a>
                            </li>
                            <li>
                              <a id="top-bar-delete" onClick={this.handleClick.bind(this, 'delete')}><FontAwesome name='trash'/></a>
                            </li>
                            <li>
                              <a id="top-bar-pin" onClick={this.handleClick.bind(this, 'pin')}><FontAwesome name='thumb-tack'/></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="textAlignCenter" style={{padding: '0.5rem 1.5rem'}}>
                    <div style={{height: '10px',
                        width: '10px',
                        backgroundColor: amIAliveColor,
                        float: 'left',
                        marginTop: '4px',
                        borderRadius: '35px',
                        marginRight: '4px'}}>
                    </div>{latency} ms
                    <div className="page-title" style={{fontWeight:'bold', textTransform: 'uppercase', color: colorMap[status]}}>{status}</div>

                    <div style={{fontWeight:'100',marginBottom:'1.5rem'}}>Data last collected at {lastReboot}</div>

                        <table className="sensor-details-table" style={{width:'90%',margin:'0rem auto 2rem auto',fontWeight:'100'}}>
                            {renderStats(stats)}
                        </table>

                    <div className="page-title">Top 5 Processes</div>

                        <table className="sensor-details-table" style={{fontWeight:'100',marginBottom:'2rem'}}>
                            {renderTop5(top5)}
                        </table>


                    <a className="button proceed expanded" onClick={this.handleClick.bind(this, 'terminal')}>
                        Launch Terminal
                    </a>

                    <a className="button proceed expanded" onClick={this.handleClick.bind(this, 'reboot')}>
                        Reboot Sensor
                    </a>

                    <IndexLink className="button proceed expanded" activeClassName='active' to={historicalLink}>
                        Historical Charts
                    </IndexLink>
                </div>
                <DeleteSensor {...this.state}/>
                <PinSensor macAdd={macAdd}/>
                <EditSensor {...this.state}/>
                <RebootSensor macAdd={macAdd}/>
                <Terminal macAdd={macAdd} port={port}/>
            </div>
        );
    }
};

module.exports = SensorDetails;
