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
    "no data": "sensorBlockSquare grey sensorList",
    "paused": "sensorBlockSquare black sensorList"
}

class SensorList extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(sensorData, action) {
        var {dispatch} = this.props;
        var macAdd = sensorData['macAdd'];

        var tobascoSauce = document.createEvent("Event");

        tobascoSauce.data = {
            macAdd: macAdd
        };

        tobascoSauce.initEvent("tobascoSauce", true, true);
        document.dispatchEvent(tobascoSauce);

        dispatch(actions.storeActiveSensor(macAdd));

    }

    render() {

        console.log("this.props.sensorData", this.props.sensorData);

        var cls = colorMap[this.props.sensorData['status']];
        var id = this.props.sensorData['sensorId'];

        return (
            <li className="sensorList">
                <div className={cls} data-toggle="offCanvas" onClick={() => this.handleClick(this.props.sensorData)}>{id}</div>
            </li>
        );
    }
}

module.exports = connect()(SensorList);
