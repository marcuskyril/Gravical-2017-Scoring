var React = require('react');
var Abnormal = require('Abnormal');
var Uptime = require('Uptime');
var SensorHealthOverview = require('SensorHealthOverview');
var WatchList = require('WatchList');
var Tableaux = require('Tableaux');
var NotificationBar = require('NotificationBar');
var FontAwesome = require('react-fontawesome');
var BuildingOverview = require('BuildingOverview');
var AddSensor = require('AddSensor');
var EditSensor = require('EditSensor');
var DeleteSensor = require('DeleteSensor');
var UnpinSensor = require('UnpinSensor');
var RebootSensor = require('RebootSensor');
var EditSNMPSpeedTest = require('EditSNMPSpeedTest');
var PinSensor = require('PinSensor');
var Terminal = require('Terminal');
import * as Redux from 'react-redux';
import * as actions from 'actions';
var {connect} = require('react-redux');
var {Link, IndexLink} = require('react-router');
const HOST = 'ws://119.81.104.46:9000';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connection: null,
            type: "-",
            overall: [],
            bfg: [],
            notifications: [],
            sensorHealthOverviewV2: [],
            currentTime: '-',
            userDisplayName: '',
            userEmail: '',
            notificationData: {},
            filterParam: props.params.buildingName === undefined ? '' : props.params.buildingName
        }
    }

    componentDidMount() {
        // initiate websocket
        var {dispatch} = this.props;
        var that = this;
        var timestamp = '';
        var userDisplayName = '';
        var userEmail = '';

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                userDisplayName = user.displayName;
                userEmail = user.email;
                that.setState({userDisplayName: userDisplayName, userEmail: userEmail});
            }
        }, function(error) {
            console.warn(error);
        });

        var connection = new ab.Session(HOST, function() {
            connection.subscribe('', function(topic, data) {

                timestamp = new Date().toLocaleString();
                dispatch(actions.storeSyncData(timestamp, userDisplayName));

                that.setState({
                    connection: connection,
                    overall: data.overall,
                    sensorHealthOverviewV2: data.overview,
                    bfg: data.BFG,
                    currentTime: timestamp,
                    notifications: data.notifications,
                    serverOverview: data.serverOverview
                });
            });

        }, function() {

            // refresh browser when connection is unavailable
            console.warn('WebSocket connection closed: all data unavailable');

            // if(this.props && this.props.location.pathname === '/dashboard') {
            //     alert("Connection closed, refreshing browser");
            //     window.location.href = '/';
            // }

        }, {'skipSubprotocolCheck': true});

        // close dropdowns
        window.addEventListener('click', function(e) {
            var pane = e.srcElement;
            if (!($(e.target).hasClass("pane"))) {

                var dropdowns = document.getElementsByClassName("routerDropdown");
                var i;

                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];

                    if (openDropdown.style.display === "block") {
                        openDropdown.style.display = "none";
                    }
                }
            }
        });
    }

    componentWillUnmount() {
        // close websocket
        if (this.state.connection) {
            this.state.connection.close();
        }
    }

    launchAddSensor() {
        $('#add-sensor-modal').foundation('open');
    }

    toggleHide(id) {
        var panel = $('#' + id);

        if ((panel).css('display') === 'block') {
            panel.slideUp();
            panel.siblings().addClass('callout-minimize');

        } else {
            panel.slideDown();
            panel.siblings().removeClass('callout-minimize');
            panel.siblings().addClass('callout-dark-header');
        }
    }

    render() {

        var {userDisplayName, userEmail} = this.state;

        return (

            <div className="dashboard margin-top-md">
                <div className="row">
                    <div className="columns small-12 medium-12 large-3 margin-bottom-small">
                        <BuildingOverview filter={this.state.filterParam} data={this.state.overall}/>
                    </div>
                    <div className="columns small-12 medium-12 large-9">
                        <div>
                            <div className="callout callout-minimize">
                                <div className="page-title">Watch List</div>
                                <button onClick={() => this.toggleHide('watchList')} className="icon-btn-text-small">
                                    <FontAwesome name='expand'/>
                                </button>
                            </div>
                            <div className="callout callout-dark" id="watchList">
                                <WatchList data={this.state.bfg}/>
                            </div>
                        </div>

                        <div>
                            <div className="callout callout-dark-header">
                                <div className="page-title">Health Overview</div>
                                <button onClick={this.launchAddSensor} className="icon-btn-text-small">
                                    <FontAwesome name='plus-circle' style={{
                                        marginRight: '0.5rem'
                                    }}/>
                                    Add Sensor / Server
                                </button>
                                <AddSensor type={this.state.type}/>
                                <UnpinSensor userId={userDisplayName} userEmail={userEmail}/>
                                <Terminal userId={userDisplayName} userEmail={userEmail}/>
                                <PinSensor userId={userDisplayName} userEmail={userEmail}/>
                                <EditSNMPSpeedTest userId={userDisplayName} userEmail={userEmail}/>
                            </div>
                            <div className="callout callout-dark">
                                <SensorHealthOverview filter={this.state.filterParam} data={this.state.sensorHealthOverviewV2} serverData={this.state.serverOverview}/>
                            </div>
                        </div>

                        <div>
                            <div className="callout callout-dark-header">
                                <div className="page-title">Abnormal Behaviour</div>
                            </div>
                            <div className="callout callout-dark">
                                <Abnormal data={this.state.bfg}/>
                            </div>
                        </div>

                    </div>

                    <div className="allSensors columns medium-12 large-9">
                        <div className="callout callout-dark-header">
                            <div className="page-title">All Sensors</div>
                        </div>
                        <div className="callout callout-dark" id="bfg">
                            <Tableaux filter={this.state.filterParam} data={this.state.bfg}/>
                        </div>
                    </div>
                </div>

                <div className="row textAlignCenter">
                    <div className="columns small-12 medium-12 large-12 margin-bottom-small">

                        <div className="sub-header">
                            {this.state.userDisplayName}
                            | Last sync at {this.state.currentTime}
                            <FontAwesome name='refresh' spin style={{
                                textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
                                marginLeft: '0.5rem'
                            }}/>
                        </div>

                    </div>
                </div>

                <NotificationBar notificationData={this.state.notifications} timestamp={this.state.currentTime}/>
            </div>
        );
    }
};

module.exports = connect()(Dashboard);
