var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import {connect} from 'react-redux';
var {Link, IndexLink} = require('react-router');
var store = require('configureStore').configure();

var colorMap = {
    "ok": "sensorBlockSquare green sensorList",
    "warning": "sensorBlockSquare yellow sensorList",
    "danger": "sensorBlockSquare orange sensorList",
    "down": "sensorBlockSquare red sensorList",
    "no data": "sensorBlockSquare grey sensorList"
}

class VerticalMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            reboot_available: this.props.sensorData['reboot'],
            isWatched: this.props.sensorData['watchlist']
        }
    }

    handleClick(sensorData, action) {
        var {dispatch} = this.props;
        var macAdd = sensorData['macAdd'];

        console.log(sensorData);

        // document.getElementById("sensorDetailsIFrame").src = "./offCrepe.html?offCanMac=" + macAdd;
        dispatch(actions.storeActiveSensor(sensorData));
    }

    render() {
        // var historicalUrl = `/historical/${this.props.macAdd}`;

        var cls = colorMap[this.props.sensorData['status']];
        var id = this.props.sensorData['sensorId'];

        return (
            <li className="sensorList">
                <div className={cls} data-toggle="offCanvas" onClick={() => this.handleClick(this.props.sensorData)}>{id}</div>
            </li>
        );
    }
}

module.exports = connect()(VerticalMenu);
