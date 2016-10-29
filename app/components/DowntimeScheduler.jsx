var React = require('react');
var FontAwesome = require('react-fontawesome');
var downtimeSchedulerAPI =require('downtimeSchedulerAPI');
var Select = require('react-select');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.momentLocalizer(moment);

const repeatInterval = [
    {
        label: 'daily',
        value: 'daily'
    }, {
        label: 'weekly',
        value: 'weekly'
    }, {
        label: 'monthly',
        value: 'monthly'
    }
];

const timeInterval = [
    {
        label: '0000',
        value: '0000'
    }, {
        label: '00:30',
        value: '00:30'
    }, {
        label: '01:00',
        value: '01:00'
    }, {
        label: '01:30',
        value: '01:30'
    }, {
        label: '02:00',
        value: '02:00'
    }, {
        label: '02:30',
        value: '02:30'
    }, {
        label: '03:00',
        value: '03:00'
    }, {
        label: '04:30',
        value: '04:30'
    }, {
        label: '05:00',
        value: '05:00'
    }, {
        label: '06:30',
        value: '06:30'
    }, {
        label: '07:00',
        value: '07:00'
    }, {
        label: '08:30',
        value: '08:30'
    }, {
        label: '09:00',
        value: '09:00'
    }, {
        label: '10:30',
        value: '10:30'
    }, {
        label: '11:00',
        value: '11:00'
    }, {
        label: '12:30',
        value: '12:30'
    }, {
        label: '13:00',
        value: '13:00'
    }, {
        label: '13:30',
        value: '13:30'
    }, {
        label: '14:00',
        value: '14:00'
    }, {
        label: '14:30',
        value: '14:30'
    }, {
        label: '15:00',
        value: '15:00'
    }, {
        label: '15:30',
        value: '15:30'
    }, {
        label: '16:00',
        value: '16:00'
    }, {
        label: '16:30',
        value: '16:30'
    }, {
        label: '17:00',
        value: '17:00'
    }, {
        label: '18:30',
        value: '18:30'
    }, {
        label: '19:00',
        value: '19:00'
    }, {
        label: '19:30',
        value: '19:30'
    }, {
        label: '20:00',
        value: '20:00'
    }, {
        label: '20:30',
        value: '20:30'
    }, {
        label: '21:00',
        value: '21:00'
    }, {
        label: '21:30',
        value: '21:30'
    }, {
        label: '22:00',
        value: '22:00'
    }, {
        label: '22:30',
        value: '22:30'
    }, {
        label: '23:00',
        value: '23:00'
    }, {
        label: '23:30',
        value: '23:30'
    }
];

const events = [
    {
        'title': '*SCAPE',
        'allDay': true,
        'startDate': new Date(2016, 9, 0),
        'endDate': new Date(2016, 10, 0)
    }, {
        'title': 'KRH',
        'startDate': new Date(2016, 9, 7),
        'endDate': new Date(2016, 9, 10)
    }, {
        'title': 'SCP',
        'startDate': new Date(2016, 9, 13, 0, 0, 0),
        'endDate': new Date(2016, 9, 20, 0, 0, 0)
    }
];

class DowntimeScheduler extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            allSensors: ''
        }
    }

    viewSensors(event) {

        var that = this;

        downtimeSchedulerAPI.retrieveSensors(event.title).then(function(response) {
            if(response.error) {
                console.log("Error", response.error);
            } else {
                console.log("setting state", that.state);
                that.setState({
                    allSensors: response
                });
            }
        });

    }

    render() {

        return (
            <div className="margin-top-md">
                <div className="large-8 columns large-centered">

                    <div className="page-title margin-bottom-small">Downtime Scheduler</div>

                        <BigCalendar
                            selectable
                            defaultView='month'
                          events={events}
                          timeslots={30}
                          startAccessor='startDate'
                          endAccessor='endDate'
                          onSelectEvent={this.viewSensors.bind(this)}
                          style={{
                              height: '600px'
                          }}
                        />

                    <div className="row margin-top-md">
                        <div className="columns large-6">
                            <SensorList allSensors={this.state.allSensors}/>
                        </div>
                        <div className="columns large-6">
                            <div className="page-title">Do some cool stuff</div>
                            <p>Nothing selected</p>
                        </div>
                    </div>

                    <div style={{height: '500px'}} className="row margin-top-md">
                        <div className="columns large-6">
                            <Scheduler />
                        </div>
                        <div className="columns large-6">
                            <form>
                                <label>Start Date
                                    <input ref="startDate" type="date"/>
                                </label>
                                <label>Start Time
                                    <Select options={timeInterval}/>
                                </label>
                                <label>End Date
                                    <input ref="endDate" type="date"/>
                                </label>
                                <label>End Time
                                    <Select options={timeInterval}/>
                                </label>
                                <label>Repeat?
                                    <Select options={repeatInterval}/>
                                </label>
                                <button className="button proceed expanded margin-top-md">That's it for today.</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

class SensorList extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            building: '-',
            allSensors: {}
        }
    }

    componentWillReceiveProps(props) {
        console.log("sensorlist props", props);
        this.setState({
            building: props['allSensors']['building'],
            allSensors: props['allSensors']
        });
    }

    render() {

        var {allSensors, building} = this.state;
        var rows = [];

        if(allSensors !== undefined) {

            var test = allSensors['all_sensors'];
            if(test !== undefined) {
                test.forEach(function(sensor) {
                    rows.push (
                        <tr key={sensor['macAdd']}>
                            <td>{sensor['macAdd']}</td>
                            <td>{`${sensor['areaId']}${sensor['location']}`}</td>
                            <td>
                                <a style={{marginRight: '5px'}}><FontAwesome name='edit'/></a>
                                <a><FontAwesome name='trash'/></a>
                            </td>
                        </tr>
                    );
                });
            }
        }

        return(
            <div>
                <div className="page-title">Manage sensors</div>
                <p>The following sensors at {building} have been scheduled for downtime</p>
                <table>
                    <tbody>
                        <tr style={{textAlign: 'left'}}>
                            <th>Mac Address</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

class Scheduler extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            building: '-',
            allSensors: {},
            options: [],
            value: []
        }
    }

    handleChange() {
        var building = this.refs.building.value;
        var that = this;

        downtimeSchedulerAPI.retrieveSensors(building).then(function(response) {
            if(response.error) {
                console.log("Error", response.error);
            } else {
                console.log("response", response);

                var building = response['building'];
                var options = [];

                response['all_sensors'].forEach(function(sensor) {
                    options.push(
                        {
                            value: sensor['macAdd'],
                            label: `${building} ${sensor['location']}${sensor['areaId']}`
                        }
                    )
                });

                that.setState({
                    building: building,
                    allSensors: response['all_sensors'],
                    options: options
                });
            }
        });
    }

    handleMultiSelect(value) {
        console.log("Selected: ", value);
        this.setState({ value });
    }

    render() {
        return(
            <div>
                <div className="page-title">Schedule Downtime</div>
                <label>Building
                    <select ref="building" name="building" id="building" onChange={this.handleChange.bind(this)}  >
                        <option value=""></option>
                        <option value="*SCAPE">*SCAPE</option>
                        <option value="KRH">KRH</option>
                        <option value="SCP">SCP</option>
                    </select>
                </label>

                <Select name='sensor-list' options={this.state.options} value={this.state.value} multi onChange={this.handleMultiSelect.bind(this)}/>
            </div>
        );
    }
}

module.exports = DowntimeScheduler;
