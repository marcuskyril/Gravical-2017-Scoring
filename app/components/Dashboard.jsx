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
var addModal = null;
var unpinModal = null;
var {Link, IndexLink} = require('react-router');

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          connection: null,
          type: "-",
          deleteMac: "",
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

      addModal = new Foundation.Reveal($('#add-sensor-modal'));

      var that = this;

      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              that.setState({userDisplayName: user.displayName});
          }
      }, function(error) {
          console.warn(error);
      });

      var connection = new ab.Session('ws://opsdev.sence.io:9000', function() {
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
          console.warn('WebSocket connection closed: all data unavailable');
      }, {'skipSubprotocolCheck': true});

      // close dropdowns

      window.addEventListener('click', function(e) {

        var pane = e.srcElement;
        // console.log("pane: ", pane);
        if(!($(e.target).hasClass("sensorBlockSquare"))){
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

    componentWillUnmount(){
      // close websocket
      if(this.state.connection) {
        this.state.connection.close();
      }
    }

    launchAddSensor() {
        // modal = new Foundation.Reveal($('#add-sensor-modal'));
        addModal.open();
    }

    toggleHide(id) {
      var panel = $('#'+id);

      if((panel).css('display') === 'block') {
        panel.slideUp();
        panel.siblings().addClass('callout-minimize');

      } else {
        panel.slideDown();
        panel.siblings().removeClass('callout-minimize');
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
                  <div className="columns large-12">
                    <div className="callout-top-header margin-bottom-small">
                      <ul className="header-list">
                        <li>
                          <div className="sub-header">
                            Welcome, {this.state.userDisplayName}
                          </div>
                        </li>
                        <li>
                          <div className="sub-header margin-bottom-small">
                            Last sync at {this.state.currentTime}
                            <FontAwesome name='refresh' spin style={{
                                textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', marginLeft: '0.5rem'
                            }}/>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="columns medium-3 large 3 margin-bottom-small">
                      <BuildingOverview data={this.state.overall} />
                  </div>
                  <div className="columns medium-9 large 9">
                    <div>
                      <div className="callout callout-dark-header"><h4 className="header">Watch List</h4>
                        <button onClick={() => this.toggleHide('watchList')} className="icon-btn-text-small">
                          <FontAwesome name='expand'/>
                        </button>
                      </div>
                      <div className="callout callout-dark" id="watchList">
                        <WatchList data={this.state.bfg}/>
                      </div>
                    </div>

                    <div>
                      <div className="callout callout-dark-header"><h4 className="header">Health Overview</h4>
                      <button onClick={this.launchAddSensor} className="icon-btn-text-small">
                        <FontAwesome name='plus-circle'/> Add Sensor / Server
                      </button>
                      <AddSensor type={this.state.type}/>
                      <EditSensor/>
                      <UnpinSensor/>
                      <DeleteSensor deleteMac={this.state.deleteMac}/>
                      </div>
                      <div className="callout callout-dark">
                        <SensorHealthOverview data={this.state.sensorHealthOverviewV2} serverData={this.state.serverOverview}/>
                      </div>
                    </div>

                    <div>
                      <div className="callout callout-dark-header"><h4 className="header">Abnormal Behaviour</h4></div>
                      <div className="callout callout-dark">
                      <Abnormal data={this.state.bfg}/>
                      </div>
                    </div>

                  </div>

                  <div className = "columns large-9">
                    <div className="callout callout-dark-header"><h4 className="header">All Sensors</h4></div>
                    <div className="callout callout-dark" id="bfg">
                      <Tableaux data={this.state.bfg}/>
                    </div>
                  </div>
                </div>
                <NotificationBar notificationData={this.state.notifications} timestamp={this.state.currentTime}/>
            </div>
        );
    }
};

module.exports = Dashboard;
