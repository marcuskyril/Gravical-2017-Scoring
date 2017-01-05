var React = require('react');
var SensorHealthOverview = require('SensorHealthOverview');
var WatchList = require('WatchList');
var Tableaux = require('Tableaux');
var Results = require('Results');
var FontAwesome = require('react-fontawesome');
var BuildingOverview = require('BuildingOverview');
import AddSensor from 'AddSensor';
import * as Redux from 'react-redux';
import * as actions from 'actions';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
var {connect} = require('react-redux');
var {Link, IndexLink} = require('react-router');
const HOST = 'ws://office.livestudios.com:41000';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connection: null,
            // type: "-",
            // overall: [],
            // bfg: [],
            results: [],
            // notifications: [],
            // sensorHealthOverviewV2: [],
            currentDetail: '-',
            currentEvent: '-',
            totalDetails: '-',
            currentTime: '-',
            userDisplayName: '',
            userEmail: '',
            notificationData: {},
            filterParam: props.params.buildingName === undefined
                ? ''
                : props.params.buildingName
        }
    }

    componentDidMount() {
        // initiate websocket
        var {dispatch} = this.props;
        var that = this;
        var timestamp = '';
        var userDisplayName = '';
        var userEmail = '';


        var connection = new ab.Session(HOST, function() {
            connection.subscribe('', function(topic, data) {

                timestamp = moment().format('YYYY-MM-DD, h:mm:ss a');
                // dispatch(actions.storeSyncData(timestamp, userDisplayName, userEmail));

                console.log("jalapeño", data['total_details']['num_of_details']);
                that.setState({
                    connection: connection,
                    currentTime: timestamp,
                    currentEvent: data['current_event'],
                    currentDetail: data['current_detail'],
                    totalDetails: data['total_details']['num_of_details'],
                    results: data['list']
                });
            });

        }, function() {

            // refresh browser when connection is unavailable
            console.warn('WebSocket connection closed: all data unavailable');

            if (this.state !== undefined) {
                this.state.connection.subscribe('', function(topic, data) {

                    console.warn('Reinitiating connection');
                    timestamp = moment().format('YYYY-MM-DD, h:mm:ss a');

                    that.setState({
                        connection: connection,
                        currentTime: timestamp,
                        currentEvent: data['current_event'],
                        currentDetail: data['current_detail'],
                        totalDetails: data['total_details']['num_of_details'],
                        results: data['list']
                    });
                });
            }
        }, {'skipSubprotocolCheck': true});
    }

    componentWillUnmount() {
        // close websocket
        if (this.state.connection) {
            this.state.connection.close();
        }
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

        var {userDisplayName, userEmail, results, currentEvent, currentTime, currentDetail, totalDetails} = this.state;
        console.log("currentEvent", currentEvent);

        return (

            <div className="dashboard margin-top-md">
                <div className="row">
                    <div className="columns small-12 medium-12 large-5">
                        <div>
                            <div className="callout callout-minimize">
                                <div className="page-title">Watch List</div>
                                <button onClick={() => this.toggleHide('watchList')} className="icon-btn-text-small">
                                    <FontAwesome name='expand'/>
                                </button>
                            </div>
                            <div className="callout callout-dark" id="watchList">
                                <WatchList data={results}/>
                            </div>
                        </div>

                    </div>

                    <div className="allSensors columns medium-12 large-7">
                        <div className="callout callout-dark-header">
                            <div className="page-title">Current Event: {currentEvent} {currentDetail}/{totalDetails}</div>
                        </div>
                        <div className="callout callout-dark" id="bfg">
                            <Tableaux data={results}/>
                        </div>
                    </div>
                </div>


                <div className="row textAlignCenter">

                    <div className="columns small-12 medium-12 margin-bottom-small">
                        <div className="callout callout-dark-header">
                            <div className="page-title">All Results</div>
                            <p>This section will only be updated after each event.</p>
                        </div>
                        <div className="callout callout-dark">
                            <Tabs>
                              <TabList>
                                <Tab>12th January</Tab>
                                <Tab>13th January</Tab>
                                <Tab>14th January</Tab>
                                <Tab>15th January</Tab>
                              </TabList>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">U17 Girls - Qualifiers</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Novice Women - Qualifiers</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Boys - Qualifiers</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Novice Men - Qualifiers</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>
                              </TabPanel>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">Intermediate Women - Qualifiers</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Intermediate Men - Qualifiers</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>
                              </TabPanel>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">Open Women - Qualifiers</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Men - Qualifiers</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Women - Semi-Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>
                              </TabPanel>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">Open Men - Semi-Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Girls - Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Boys - Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Novice Women - Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Novice Men - Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Intermediate Women - Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Intermediate Men - Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Men - Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Women - Finals</div>
                                  <Results filter={this.state.filterParam} data={this.state.bfg}/>
                              </TabPanel>
                          </Tabs>
                        </div>

                        <div className="page-title">
                            Last sync at {currentTime}
                            <FontAwesome name='refresh' spin style={{
                                textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
                                marginLeft: '0.5rem'
                            }}/>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
};

module.exports = connect()(Dashboard);
