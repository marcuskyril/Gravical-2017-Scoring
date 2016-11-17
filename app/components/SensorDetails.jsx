var React = require('react');
var axios = require('axios');
var DeleteSensor = require('DeleteSensor');
var PinSensor = require('PinSensor');
var EditSensor = require('EditSensor');
var RebootSensor = require('RebootSensor');
var PauseSensor = require('PauseSensor');
var Terminal = require('Terminal');
import * as Redux from 'react-redux';
import * as actions from 'actions';
var {connect} = require('react-redux');
var FontAwesome = require('react-fontawesome');
var {Link, IndexLink} = require('react-router');
var socket;

var colorMap = {
  "ok" : "#006600",
  "warning" : "#ffcc00",
  "danger" : "#cc7a00",
  "down" : "#990000",
  "no data" : "#737373",
  "paused" : "#1a1b1b"
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

        const SOCKET_URL = "ws://119.81.104.46:9010/SensorStatus";

        window.addEventListener('tobascoSauce', function(e) {

            var macAdd = e.data.macAdd;
            console.log("Off-canvas mac address: ", macAdd);

            try {
                socket = new WebSocket(SOCKET_URL);

                socket.onopen = function(msg) {
                    console.log("connected");
                    that.setState({
                        isLoading: true
                    });
                    that.send(macAdd);
                };

                socket.onmessage = function(msg) {

                    var response = JSON.parse(msg.data);

                    that.setState({
                        isLoading: false,
                        macAdd: macAdd,
                        building: response['building'],
                        amIAlive: response["am_i_alive"],
                        region: response["geo_region"],
                        level: response["sensor_location_level"],
                        areaID: response["sensor_location_id"],
                        location: `${response["sensor_location_level"]}${response["sensor_location_id"]}`
                    });

                    if (response.error !== "no data") {

                        var latency = '';

                        if (response["router_latency"] != "-") {
                            latency = parseFloat(Math.round(response["router_latency"] * 100) / 100).toFixed(2);
                        }

                        if(response["watchlist"]) {
                            $('#top-bar-pin').addClass('button-disabled');
                        } else {
                            $('#top-bar-pin').removeClass('button-disabled');
                        }

                        that.setState({
                            latency: latency,
                            port: response["port"],
                            status: response["status"],
                            lastReboot: response["last_reboot"],
                            diagnosis: response["diagnosis"],
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
            that.setState({
                isLoading: true,
                building: '-',
                macAdd: '',
                latency: '-',
                amIAlive: false,
                location: '-',
                status: '-',
                lastReboot: '-',
                stats: {},
                top5: []
            })
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

    render() {

        var {macAdd, building, latency, amIAlive, isLoading, port, status, location, lastReboot, diagnosis, stats, top5} = this.state;
        var {userId, dispatch} = this.props;
        var location = `${building} ${location}`
        var amIAliveColor = amIAlive ? "green" : colorMap['down'];
        var dataColStatus = status === "down" ? "Data last collected at " : "Up since "

        $('#uptime').removeClass('table-row-highlight');
        $('#temp').removeClass('table-row-highlight');
        $('#cpu').removeClass('table-row-highlight');
        $('#storage').removeClass('table-row-highlight');
        $('#ram').removeClass('table-row-highlight');

        if ((diagnosis != null) && Object.keys(diagnosis["fields"]).length > 0) {
            for (var key in diagnosis["fields"]) {
                if (diagnosis["fields"].hasOwnProperty(key)) {
                    $('#'+diagnosis['fields'][key]).addClass('table-row-highlight');
                }
            }
        }

        function renderSensorDetails() {

            if(isLoading) {
                return (
                    <div className="page-title">Loading... </div>
                );
            } else {
                return (
                    <div></div>
                );
            }
        }

        return (
            <div>
                <TopBar dispatch={dispatch} macAdd={macAdd} userId={userId} building={building} location={location}/>

                <div className="textAlignCenter" style={{padding: '0.5rem 1.5rem'}}>
                    {renderSensorDetails()}
                    <span style={{height: '10px',
                        width: '10px',
                        backgroundColor: amIAliveColor,
                        borderRadius: '35px',
                        marginRight: '0.4rem',
                        display: 'inline-block'}}>
                    </span>{latency} ms
                    <div className="page-title" style={{fontWeight:'bold', textTransform: 'uppercase', color: colorMap[status]}}>{status}</div>

                    <div style={{fontWeight:'100',marginBottom:'1.5rem'}}>{dataColStatus} <br></br> {lastReboot}</div>

                    <Stats stats={stats}/>
                    <Top5Processes processes={top5}/>

                    <ButtonList dispatch={dispatch} macAdd={macAdd} userId={userId} building={building} location={location} status={status}/>
                </div>
                <DeleteSensor {...this.state}/>
                <PauseSensor {...this.state}/>
                <PinSensor macAdd={macAdd}/>
                <EditSensor {...this.state}/>
                <RebootSensor macAdd={macAdd}/>
                <Terminal macAdd={macAdd} port={port}/>
            </div>
        );
    }
};

class Stats extends React.Component {
    render() {

        var {stats} = this.props;
        var rows = [];

        if(stats != undefined && Object.keys(stats).length > 0) {
            for(var key in stats) {
                rows.push(
                    <tr key={key} id={key}>
                        <td>{key}</td>
                        <td>{stats[key]}</td>
                    </tr>
                );
            }
        } else {
            return (
                <div className="margin-bottom-small">No data available.</div>
            );
        }

        return (
            <div>
                <table className="sensor-details-table" style={{width:'90%',margin:'0rem auto 2rem auto',fontWeight:'100'}}>
                    <thead>
                        <tr>
                            <th>
                                Metric
                            </th>
                            <th>
                                %
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

class Top5Processes extends React.Component {
    render() {

        var {processes} = this.props;
        var rows = [];

        if(processes != undefined && processes.length > 0) {
            for(var i = 0; i < processes.length; i++) {
                rows.push(
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>{processes[i]['process']}</td>
                        <td>{processes[i]['usage']}</td>
                    </tr>
                );
            }
        } else {
            return (
                <div></div>
            );
        }

        return (
            <div>
                <div className="page-title">Top 5 Processes</div>
                <table className="sensor-details-table" style={{fontWeight:'100',marginBottom:'2rem'}}>
                    <thead>
                        <tr>
                            <th>
                                SN
                            </th>
                            <th>
                                Process Number
                            </th>
                            <th>
                                %
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

class ButtonList extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(type) {

        var {dispatch, macAdd, building, location, userId} = this.props;

        switch(type) {
            case 'terminal':
                var actionDesc = `Launched terminal for ${macAdd} (${location})`;
                dispatch(actions.startAddToLog(userId, actionDesc));

                $('#terminal').foundation('open');
                break;
            case 'pause':
                $('#pause-sensor-modal').foundation('open');
                break;
            case 'reboot':
                $('#reboot-sensor-modal').foundation('open');
                break;
        }
    }

    render() {
        var {status, building} = this.props;

        if(status === '-') {
            return (
                <div></div>
            );
        }

        var pauseMsg = status === "paused" ? "Unpause" : "Pause"
        var historicalLink = `/historical/${this.props.macAdd}`;
        // var historicalLink = `/historical/${this.props.building}+${this.props.macAdd}`;

        return (
            <div>
                <a className="button proceed expanded" onClick={this.handleClick.bind(this, 'pause')}>
                    {pauseMsg} Sensor
                </a>

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
        );
    }
}

class TopBar extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(type) {

        switch(type) {
            case 'delete':
                $('#delete-sensor-modal').foundation('open');
                break;

            case 'pin':
                $('#pin-sensor-modal').foundation('open');
                break;

            case 'edit':
                $('#edit-sensor-modal').foundation('open');
                break;
        }
    }


    render() {

        var {dispatch, userId, macAdd, location, building} = this.props;

        return (
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
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {sensorData: state.activeSensor, userId: state.syncData.userId}
}

module.exports = connect(mapStateToProps)(SensorDetails);
