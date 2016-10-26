var React = require('react');
var ServerList = require('ServerList');
var FontAwesome = require('react-fontawesome');
var VerticalMenu = require('VerticalMenu');
var {Link, IndexLink} = require('react-router');
import {connect} from 'react-redux';
import * as Redux from 'react-redux';
import * as actions from 'actions';

const HOST = 'http://opsdev.sence.io:4201/';

var dataList = [];

class Building extends React.Component {
    render() {

        var uptimeLink = `/uptime/${this.props.buildingName}`;

        return (
            <div className="column row">

                <div className="header">
                    {this.props.buildingName}
                    <div style={{
                        float: 'right'
                    }}>
                        <span style={{fontWeight: '300'}}>
                            Total Count: {this.props.sensorCount}
                        </span>
                        <span>
                            <IndexLink activeClassName='active' to={uptimeLink}>
                                <FontAwesome name='bar-chart' style={{
                                    marginLeft: '5px'
                                }}/>
                            </IndexLink>
                        </span>
                    </div>
                </div>
                <table className="sensorHealthTable">
                    <BuildingHeader dispatch={this.props.dispatch} snmpSpeedTest={this.props.speedTest}/>
                    <LevelList areaArray={this.props.areaNames} levelArray={this.props.levelNames} sensors={this.props.sensors}/>
                </table>
            </div>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange() {
        this.props.onUserInput(this.refs.filterTextInput.value);
    }

    render() {

        return (
            <form id="buildingFilter">
                <input type="text" style={{
                    width: "50%"
                }} placeholder="Filter Results" value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange.bind(this)}/>
            </form>
        );
    }
}

class BuildingList extends React.Component {
    render() {

        var rows = [];
        var allBuildings = [];

        var buildings = this.props.data;

        for (var property in buildings) {
            if (buildings.hasOwnProperty(property)) {
                var buildingName = property;

                var temp = {
                    buildingName: buildingName,
                    areaNames: buildings[property]["area_names"],
                    levelNames: buildings[property]["level_names"],
                    sensors: buildings[property]["sensors"],
                    sensorCount: buildings[property]["sensor_count"],
                    speed_test: buildings[property]["snmp_speed_test"]
                }

                allBuildings.push(temp);
            }
        }

        allBuildings.forEach(function(building) {
            var buildingName = building.buildingName;
            var areaNames = building.areaNames;
            var levelNames = building.levelNames;
            var sensors = building.sensors;
            var sensorCount = building.sensorCount;
            var speedTest = building.speed_test;

            if ((buildingName.toLowerCase()).indexOf((this.props.filterText.toLowerCase())) === -1) {
                return <div></div>
            }

            rows.push(<Building key={buildingName} dispatch={this.props.dispatch} buildingName={buildingName} areaNames={areaNames} levelNames={levelNames} sensors={sensors} sensorCount={sensorCount} speedTest={speedTest}/>);
        }.bind(this));

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class BuildingHeader extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(sensor) {
        var div = document.getElementById('routerDropdown'+sensor);
        if (sensor != "-") {
            if (div.style.display === 'none') {
                div.style.display = 'block';
            }  else {
                div.style.display = 'none';
            }
        }
    }

    launchSpeedTestEdit() {
        var {snmpSpeedTest, dispatch} = this.props;
        var {sensor} = snmpSpeedTest;
        dispatch(actions.storeActiveSensor(sensor));
        $('#edit-snmp-speedtest-modal').foundation('open');
    }

    render() {

        var {snmpSpeedTest} = this.props;
        var {cpu_freq, cpu_load, current_interval, download_speed, memory_total, memory_used, model, processor_temp, sensor, storage_total, storage_used, system_name, time, upload_speed, uptime} = snmpSpeedTest;
        var memory = (memory_used/1000).toFixed(2)+" / "+(memory_total/1000).toFixed(2)+"MB";
        var storage = (storage_used/1000).toFixed(2)+" / "+(storage_total/1000).toFixed(2)+"MB";
        var temp = (processor_temp-273.15).toFixed(2)+" C";

        var id = "routerDropdown"+sensor;

        return (
            <thead>
                <tr>
                    <td style={{
                        width: "8rem"
                    }}></td>
                    <td style={{
                        "textAlign": "right",
                        "fontSize": "0.8rem",
                        fontWeight: '300'
                    }}>
                        <span style={{
                            fontWeight: '500'
                        }}>Upload</span>: {snmpSpeedTest.upload_speed}
                        Mbit/s |
                        <span style={{
                            fontWeight: '500'
                        }}> Download</span>: {snmpSpeedTest.download_speed}
                        Mbit/s

                        <button type="button" className="pane" onClick={() => this.handleClick(sensor)} style={{marginLeft:'0.5rem'}}>
                            <FontAwesome className="pane" name='caret-square-o-down' size='lg'/>
                        </button>

                        <div id={id} className="routerDropdown" style={{display: 'none', position: 'absolute', backgroundColor: '#fff', right: 0, padding: '0.5rem 0.5rem 0 0.5rem', marginRight: '2rem', boxShadow: '3px 3px 3px #888888', borderRadius: '3px'}}>
                            <a onClick={() => this.launchSpeedTestEdit()}>
                                <div style={{float:'left'}}>
                                    <FontAwesome name='edit' size='lg'/>
                                </div>
                            </a>
                            <span style={{fontWeight: '700', fontSize: '1.1rem'}}>{system_name}</span>
                            <br></br>
                            <span style={{fontWeight: '400', fontSize: '0.9rem'}}>{model}</span>
                            <br></br>
                            <span style={{fontWeight: '100', fontSize: '0.75rem'}}>{time}</span>
                            <table style={{marginTop: '0.5rem'}}>
                                <tbody>
                                    <tr>
                                        <td style={{fontWeight: '500', fontSize: '0.9rem'}}>Memory</td>
                                        <td style={{fontSize: '0.8rem', fontWeight: '300'}}>{memory}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: '500', fontSize: '0.9rem'}}>Storage</td>
                                        <td style={{fontSize: '0.8rem', fontWeight: '300'}}>{storage}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: '500', fontSize: '0.9rem'}}>CPU load</td>
                                        <td style={{fontSize: '0.8rem', fontWeight: '300'}}>{cpu_load} %</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: '500', fontSize: '0.9rem'}}>Temperature</td>
                                        <td style={{fontSize: '0.8rem', fontWeight: '300'}}>{temp}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </thead>
        );
    }
}

class LevelList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var that = this;
        var level;
        var port;

        var tableRows = [];
        var areaArray = this.props.areaArray;
        var levelArray = this.props.levelArray;
        var sensors = this.props.sensors;

        for (var i = 0; i < levelArray.length; i++) {
            var sensorsOnThisFloor = sensors[levelArray[i]];
            var temp = [];
            var superTemp = [];

            for (var j = 0; j < sensorsOnThisFloor.length; j++) {

                var position = areaArray.indexOf(sensorsOnThisFloor[j]['id']);

                superTemp[position] = {
                    macAdd: sensorsOnThisFloor[j]['mac'],
                    status: sensorsOnThisFloor[j]['status'],
                    sensorId: sensorsOnThisFloor[j]['id'],
                    region: sensorsOnThisFloor[j]['region'],
                    building: sensorsOnThisFloor[j]['building'],
                    level: sensorsOnThisFloor[j]['level'],
                    port: sensorsOnThisFloor[j]['port'],
                    reboot: sensorsOnThisFloor[j]['reboot_available'],
                    watchlist: sensorsOnThisFloor[j]['watchlist']
                }
            }

            superTemp.forEach(function(sensorData) {

                level = sensorData['level'];
                port = sensorData['port'];

                temp.push(<VerticalMenu key={sensorData['macAdd']} macAdd={sensorData['macAdd']} sensorData={sensorData}/>);

            });

            tableRows.push(
                <tr key={level}>
                    <th>
                        {level.length === 1
                            ? `0${level}`
                            : level}
                    </th>
                    <td>
                        <ul style={{
                            margin: '0px'
                        }}>
                            {temp}
                        </ul>
                    </td>
                </tr>
            );
        }

        return (
            <tbody>
                {tableRows}
            </tbody>
        );
    }
}

class SensorHealthOverview extends React.Component {

    constructor(props) {
        super(props);
        console.log("hello", props);
        this.state = {
            filterText: this.props.filter
        };
    }

    componentDidMount() {
        if (this.state.filterText === undefined) {
            this.setState({filterText: ''});
        }
    }

    handleUserInput(filterText) {
        this.setState({filterText: filterText});
    }

    render() {

        var overviewData = this.props.data;
        var {dispatch} = this.props;
        var serverData = {};

        for (var building in overviewData) {
            if (overviewData.hasOwnProperty(building) && overviewData[building]['geo_region'] == "VIRTUAL") {
                serverData[building] = overviewData[building];
                delete overviewData[building];
            }
        }

        return (
            <div>
                <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>

                <div className="page-title">Sensors</div>
                <hr className="divider"/>

                <BuildingList dispatch={dispatch} data={this.props.data} filterText={this.state.filterText}/>

                <div className="page-title">Servers</div>
                <hr className="divider"/>

                <ServerList data={serverData}/>

            </div>
        );
    }
}

module.exports = connect()(SensorHealthOverview);
