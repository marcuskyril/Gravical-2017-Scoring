var React = require('react');
var Tableaux = require('Tableaux');
var Results = require('Results');
var FontAwesome = require('react-fontawesome');
var climberManagementAPI = require('climberManagementAPI');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
var {connect} = require('react-redux');
var {Link, IndexLink} = require('react-router');
const HOST = 'ws://office.livestudios.com:41001';

const EVENTS = {
    "NWF" : "Novice Women Finals",
    "NMF" : "Novice Men Finals",
    "UMF" : "U17 Boys Finals",
    "UFF" : "U17 Girls Finals",
    "IMF" : "Intermediate Men Finals",
    "IWF" : "Intermediate Women Finals",
    "OMF" : "Open Men Finals",
    "OWF" : "Open Women Finals"
}

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            connection: null,
            maleResults: [],
            femaleResults: [],
            currentMaleEvent: '-',
            currentFemaleEvent: '-',
            currentTime: '-',
            currentMaleClimber: '-',
            currentFemaleClimber: '-',
            allResults: {}
        }
    }

    componentDidMount() {
        // initiate websocket
        this.connect();
        this.getAllResults();
    }

    getAllResults() {
        var that = this;
        climberManagementAPI.getAllResults().then(function(response) {
            that.setState({
                allResults: response
            });
        });
    }

    connect() {
        var that = this;
        var timestamp = '';

        var connection = new ab.Session(HOST, function() {
            connection.subscribe('', function(topic, data) {

                timestamp = moment().format('YYYY-MM-DD, h:mm:ss a');

                var maleResults = [];
                var femaleResults = [];

                if(data !== null && data.hasOwnProperty('M') && data.hasOwnProperty('W')) {

                    if(data['M'].hasOwnProperty('list') && data['W'].hasOwnProperty('list')) {
                        maleResults = that.churnOutResults(data['M']['list']);
                        femaleResults = that.churnOutResults(data['W']['list']);

                        that.setState({
                            maleResults: maleResults,
                            femaleResults: femaleResults,
                            connection: connection,
                            currentTime: timestamp,
                            currentMaleClimber: data['M']['current_climber'],
                            currentFemaleClimber: data['W']['current_climber'],
                            currentMaleEvent: data['M']['current_event'],
                            currentFemaleEvent: data['W']['current_event']
                        });
                    }

                } else {
                    console.warn('Problem siol - connection error');
                }
            });

        }, function() {

            // refresh browser when connection is unavailable
            console.warn('WebSocket connection closed: all data unavailable');

            if (this.state !== undefined) {
                this.connect();
            }
        }, {'skipSubprotocolCheck': true});
    }

    churnOutResults(rawResults) {

        var rank = 0;
        var prev_score = "0";
        var results = [];
        // console.log("raw Results", rawResults);
        if(rawResults !== undefined) {
            for(var i = 0; i < rawResults.length; i++) {
                if (rawResults[i]["score"] != prev_score) {
                    rank++;
                }
                var row = {
                    "rank" : rank,
                    "ID": rawResults[i]["ID"],
                    "name": rawResults[i]["name"],
                    "detail": rawResults[i]["detail"],
                    "score": rawResults[i]["score"]
                }
                prev_score = rawResults[i]["score"];

                results.push(row);
            }
        }

        return results;
    }

    componentWillUnmount() {
        // close websocket
        if (this.state.connection !== null) {
            // console.log("this.state.connection", this.state.connection);
            this.state.connection.close();
        }
    }

    render() {

        var {maleResults, femaleResults, currentMaleClimber, currentFemaleClimber, currentMaleEvent, currentFemaleEvent, currentTime, currentDetail, totalDetails, allResults} = this.state;
        // console.log("results", results);
        return (

            <div className="dashboard margin-top-md">
                <div className="row">
                    <div>
                        <img src="images/banner2.jpg" style={{marginBottom:'1.5rem', padding: "0rem 1rem"}}/>
                    </div>
                    <div className="columns small-12 medium-12 large-6">
                        <div>
                            <div className="callout callout-dark-header">
                                <div className="page-title">Current Event: {currentMaleEvent === "-" ? "-" : EVENTS[currentMaleEvent]} </div>
                                <div className="header-md">Current Climber: {currentMaleClimber === "-" ? "-" : currentMaleClimber} </div>
                            </div>
                            <div className="callout callout-dark" id="watchList2">
                                <Tableaux data={maleResults}/>
                            </div>
                        </div>

                    </div>

                    <div className="allSensors columns medium-12 large-6">
                        <div className="callout callout-dark-header">
                            <div className="page-title">Current Event: {currentFemaleEvent === "-" ? "-" : EVENTS[currentFemaleEvent]} </div>
                            <div className="header-md">Current Climber: {currentFemaleClimber === "-" ? "-" : currentFemaleClimber} </div>
                        </div>
                        <div className="callout callout-dark" id="bfg">
                            <Tableaux data={femaleResults}/>
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
                                <Tab>12th Jan</Tab>
                                <Tab>13th Jan</Tab>
                                <Tab>14th Jan</Tab>
                                <Tab>15th Jan</Tab>
                              </TabList>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">U17 Girls - Qualifiers</div>
                                  <Results data={allResults['UFQ']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Novice Women - Qualifiers</div>
                                  <Results data={allResults['NWQ']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Boys - Qualifiers</div>
                                  <Results data={allResults['UMQ']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Novice Men - Qualifiers</div>
                                  <Results data={allResults['NMQ']}/>
                              </TabPanel>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">Intermediate Women - Qualifiers</div>
                                  <Results data={allResults['IWQ']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Intermediate Men - Qualifiers</div>
                                  <Results data={allResults['IMQ']}/>
                              </TabPanel>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">Open Women - Qualifiers</div>
                                  <Results data={allResults['OWQ']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Men - Qualifiers</div>
                                  <Results data={allResults['OMQ']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Women - Semi-Finals</div>
                                  <Results data={allResults['OWS']}/>
                              </TabPanel>
                              <TabPanel>
                                  <div className="header-md margin-bottom-small">Open Men - Semi-Finals</div>
                                  <Results data={allResults['OMS']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Girls - Finals</div>
                                  <Results data={allResults['UWF']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Boys - Finals</div>
                                  <Results data={allResults['UMF']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Novice Women - Finals</div>
                                  <Results data={allResults['NWF']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Novice Men - Finals</div>
                                  <Results data={allResults['UWF']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Intermediate Women - Finals</div>
                                  <Results data={allResults['IWF']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">U17 Intermediate Men - Finals</div>
                                  <Results data={allResults['IMF']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Men - Finals</div>
                                  <Results data={allResults['OMF']}/>

                                  <div className="header-md margin-top-md margin-bottom-small">Open Women - Finals</div>
                                  <Results data={allResults['OWF']}/>
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

                        <div className="header-md" style={{
                            paddingTop: "1em",
                            fontSize: "small",
                            fontWeight: "100",
                            fontFamily: "'Roboto', sans-serif",
                            marginBottom: "1.5rem"
                        }}>
                            Copyright © 2016 <img src="images/monochrome.png" style={{height:"2em"}}/> MONOCHROME
                            <br/>
                            All Rights Reserved
                        </div>

                    </div>
                </div>
            </div>
        );
    }
};

module.exports = connect()(Dashboard);
