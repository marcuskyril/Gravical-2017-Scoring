var React = require('react');
var ServerList = require('ServerList');
var FontAwesome = require('react-fontawesome');
var VerticalMenu = require('VerticalMenu');
var deleteModal = null;
var editModal = null;
var rebootModal = null;
var terminal = null;
var {Link, IndexLink} = require('react-router');
import {connect} from 'react-redux';
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
                        <span style={{
                            fontWeight: '300'
                        }}>Total Count: {this.props.sensorCount}</span>
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
                    <BuildingHeader speedTest={this.props.speedTest}/>
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

                // console.log("buildings[property]", buildings[property]);
                // console.log("areaNames", buildings[property]["area_names"]);

                var temp = {
                    buildingName: buildingName,
                    areaNames: buildings[property]["area_names"],
                    levelNames: buildings[property]["level_names"],
                    sensors: buildings[property]["sensors"],
                    sensorCount: buildings[property]["sensor_count"],
                    speed_test: buildings[property]["speed_test"]
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

            rows.push(<Building key={buildingName} buildingName={buildingName} areaNames={areaNames} levelNames={levelNames} sensors={sensors} sensorCount={sensorCount} speedTest={speedTest}/>);
        }.bind(this));

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class BuildingHeader extends React.Component {

    handleClick() {
        // $('#edit-speed-tester-modal').foundation('open');
    }

    render() {

        var speedTest = this.props.speedTest;

        //<th colSpan="2" style={{textAlign: "center",width: '20%'}}>Level</th>

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
                        }}>Upload</span>: {speedTest.upload_speed}
                        Mbit/s |
                        <span style={{
                            fontWeight: '500'
                        }}>Download</span>: {speedTest.download_speed}
                        Mbit/s
                        <a onClick={() => this.handleClick()}><FontAwesome name='cog' style={{
                            color: '#232f32',
                            marginLeft: '1rem'
                        }}/></a>
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
        // console.log("Cool stuff from serverOverview", this.props.serverData);

        return (
            <div>
                <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>

                <div className="page-title">Sensors</div>
                <hr className="divider"/>

                <BuildingList data={this.props.data} filterText={this.state.filterText}/>

                <div className="page-title">Servers</div>
                <hr className="divider"/>

                <ServerList data={this.props.serverData}/>

            </div>
        );
    }
}

module.exports = connect()(SensorHealthOverview);
