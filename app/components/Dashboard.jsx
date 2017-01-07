var React = require('react');
var WatchList = require('WatchList');
var Tableaux = require('Tableaux');
var Results = require('Results');
var FontAwesome = require('react-fontawesome');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
var {connect} = require('react-redux');
var {Link, IndexLink} = require('react-router');
const HOST = 'ws://office.livestudios.com:41000';

const EVENTS = {
    "NWQ" : "Novice Women Qualifiers",
    "NMQ" : "Novice Men Qualifiers",
    "UMQ" : "U17 Boys Qualifiers",
    "UWQ" : "U17 Girls Qualifiers",
    "IMQ" : "Intermediate Men Qualifiers",
    "IWQ" : "Intermediate Women Qualifiers",
    "OMQ" : "Open Men Qualifiers",
    "OWQ" : "Open Women Qualifiers",
    "OMS" : "Open Women Semi-Finals",
    "OWS" : "Open Women Semi-Finals"
}

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connection: null,
            results: [],
            currentDetail: '-',
            currentEvent: '-',
            totalDetails: '-',
            currentTime: '-',
            notificationData: {}
        }
    }

    componentDidMount() {
        // initiate websocket
        this.connect();
        window.addEventListener('endEvent', function(e) {
            // that.addProgressNotification(e.data);
            alert("HOOYAH");
        }, false);
    }

    connect() {
        var that = this;
        var timestamp = '';

        var connection = new ab.Session(HOST, function() {
            connection.subscribe('', function(topic, data) {

                timestamp = moment().format('YYYY-MM-DD, h:mm:ss a');
                // console.log("jalapeño", data['total_details']['num_of_details']);

                that.setState({
                    connection: connection,
                    currentTime: timestamp,
                    currentEvent: data['current_event'],
                    currentDetail: parseInt(data['current_detail']),
                    totalDetails: parseInt(data['total_details']['num_of_details']),
                    results: data['list']
                });
            });

        }, function() {

            // refresh browser when connection is unavailable
            console.warn('WebSocket connection closed: all data unavailable');

            if (this.state !== undefined) {
                this.connect();
            }
        }, {'skipSubprotocolCheck': true});
    }

    componentWillUnmount() {
        // close websocket
        if (this.state.connection !== null) {
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

        var {results, currentEvent, currentTime, currentDetail, totalDetails} = this.state;

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
                            <div className="page-title">Current Event: {currentEvent === "" ? "-" : currentEvent} {currentDetail === 0 ? "-" : currentDetail}/{totalDetails === 0 ? "-" : totalDetails}</div>
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
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Novice Women - Qualifiers</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Boys - Qualifiers</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Novice Men - Qualifiers</div>
                                  <Results data={this.state.bfg}/>
                              </TabPanel>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">Intermediate Women - Qualifiers</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Intermediate Men - Qualifiers</div>
                                  <Results data={this.state.bfg}/>
                              </TabPanel>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">Open Women - Qualifiers</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Men - Qualifiers</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Women - Semi-Finals</div>
                                  <Results data={this.state.bfg}/>
                              </TabPanel>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">Open Men - Semi-Finals</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Girls - Finals</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Boys - Finals</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Novice Women - Finals</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Novice Men - Finals</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Intermediate Women - Finals</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Intermediate Men - Finals</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Men - Finals</div>
                                  <Results data={this.state.bfg}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Women - Finals</div>
                                  <Results data={this.state.bfg}/>
                              </TabPanel>
                          </Tabs>
                        </div>

                        <div className="header-md">
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
