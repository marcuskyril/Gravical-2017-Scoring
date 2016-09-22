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
var Terminal = require('Terminal');
var {Link, IndexLink} = require('react-router');
const HOST = 'ws://opsdev.sence.io:9000';

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
            notificationData: {}
        }
    }

    componentDidMount() {
        // initiate websocket
        //console.log("location", this.props.location.pathname);
        var that = this;

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                that.setState({userDisplayName: user.displayName});
            }
        }, function(error) {
            console.warn(error);
        });

        var connection = new ab.Session(HOST, function() {
            connection.subscribe('', function(topic, data) {

                var timestamp = new Date().toLocaleString();

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
            // console.log("pane: ", pane);
            if (!($(e.target).hasClass("sensorBlockSquare"))) {
                var dropdowns = document.getElementsByClassName("dropdown-pane");

                var i;

                for (i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.style.visibility === "visible") {
                        openDropdown.style.visibility = "hidden";
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

        // console.log("overall dashboard: ", this.state.overall);
        // console.log("bfg dashboard: ", this.state.bfg);
        // console.log("notifications dashboard: ", this.state.notifications);
        // console.log("sensorHealthOverviewV2 dashboard: ", this.state.sensorHealthOverviewV2);
        // console.log("server overview: ", this.state.serverOverview);

        return (

            <div className="dashboard margin-top-md">
                <div className="row">
                    <div className="columns small-12 medium-12 large-3 margin-bottom-small">
                        <BuildingOverview data={this.state.overall}/>
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
                                <EditSensor/>
                                <UnpinSensor/>
                                <RebootSensor/>
                                <Terminal/>
                                <DeleteSensor/>
                            </div>
                            <div className="callout callout-dark">
                                <SensorHealthOverview data={this.state.sensorHealthOverviewV2} serverData={this.state.serverOverview}/>
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
                            <Tableaux data={this.state.bfg}/>
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

module.exports = Dashboard;
