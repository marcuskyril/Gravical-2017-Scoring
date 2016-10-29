var React = require('react');
var FontAwesome = require('react-fontawesome');
var downtimeSchedulerAPI =require('downtimeSchedulerAPI');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.momentLocalizer(moment);

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
            allSensors: null
        }
    }

    viewSensors(event) {
        console.log("event", event);

        var that = this;

        downtimeSchedulerAPI.retrieveSensors(event.title).then(function(response) {
            console.log("¿hablan español?");
            if(response.error) {
                console.log("Error", response.error);
            } else {
                console.log("this is what i'm sayin", response);
                that.setState({
                    allSensors: response
                });
            }
        });

    }

    componentDidUpdate(stuff, otherstuff){
        console.log("cdu", stuff, otherstuff);
    }

    render() {

        console.log("stuff", this.state.allSensors);

        return (
            <div className="margin-top-md">
                <div className="large-8 columns large-centered">

                    <div className="page-title">Downtime Scheduler</div>

                        <BigCalendar
                            selectable
                            defaultView='month'
                          events={events}
                          timeslots={30}
                          startAccessor='startDate'
                          endAccessor='endDate'
                          onSelectEvent={this.viewSensors}
                          style={{
                              height: '600px'
                          }}
                        />

                    <div className="row">
                        <div className="columns large-6">
                            <SensorList allSensors={this.state.allSensors}/>
                        </div>
                        <div className="columns large-6">

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
    }

    componentWillReceiveProps(props) {
        console.log("sensorlist props", props);
    }

    render() {

        console.log("allSensors", this.props);
        var allSensors = this.props.allSensors;
        var rows = [];

        if(allSensors !== null){
            allSensors['all_sensors'].forEach(function(sensor){
                return (
                    <tr>
                        <td>sensor['macAdd']</td>
                        <td>`${sensor['areaId']}${sensor['areaId']}`</td>
                        <td>
                            <a><FontAwesome name='edit'/></a>
                            <a><FontAwesome name='trash'/></a>
                        </td>
                    </tr>
                );
            });
        }

        return(
            <div>
                <div className="page-title">test</div>
                <table>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}

module.exports = DowntimeScheduler;
