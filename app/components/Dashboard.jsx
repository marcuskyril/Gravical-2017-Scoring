var React = require('react');
var WeatherForm = require('WeatherForm');
var piSensorOverview = require('piSensorOverview');
var Uptime = require('Uptime');
var SensorHealthOverview = require('SensorHealthOverview');
var GeneralMetrics = require('GeneralMetrics');
var ErrorModal = require('ErrorModal');
var Tableaux = require('Tableaux');
var Notifications = require('Notifications');
var AddSensor = require('AddSensor');
var FontAwesome = require('react-fontawesome');
var BuildingOverview = require('BuildingOverview');

var Dashboard = React.createClass({
    getInitialState: function() {
        return {
          isLoading: false
        }
    },
    launchAddSensor: function() {
        var modal = new Foundation.Reveal($('#add-sensor-modal'));
        modal.open();
    },

    handleSearch: function(location) {
        var that = this;

        this.setState({
          isLoading: true,
          errorMessage: undefined
        });
    },
    render: function() {

        // var self = this;

        console.log("Dashboard's data is: ", this.props.overall);

        var {
            isLoading,
            temp,
            location,
            ok,
            danger,
            warning,
            down,
            errorMessage
        } = this.state;

        function renderError () {
          if (typeof errorMessage === 'string') {
            return (
              <ErrorModal/>
            )
          }
        }

        function renderOverview() {
            return <SensorHealthOverview ok={ok} danger={danger} warning={warning} down={down}/>
        }

        function renderMessage() {
            if (isLoading) {
                return <h3>Fetching information...</h3>;
            } else if (temp && location) {
                return <WeatherMessage temp={temp} location={location}/>;
            }
        }

        return (

            <div className="dashboard margin-top-md">
                <div className="row">
                  <div className="columns medium-3 large 3">
                      <BuildingOverview data={this.props.overall} />
                  </div>
                  <div className="columns medium-6">
                    <div className="callout callout-dark-header"><h4 className="header">At a Glance</h4></div>
                    <div className="callout callout-dark">
                      {renderOverview()}
                    </div>

                    <div>
                      <div className="callout callout-dark-header"><h4 className="header">Pi Health Overview</h4>
                      <button onClick={this.launchAddSensor} className="icon-btn-text-small">
                        <FontAwesome name='plus-circle'/> ADD SENSOR
                      </button>
                      <AddSensor/>
                      </div>
                      <div className="callout callout-dark">
                        <GeneralMetrics/>
                      </div>
                    </div>

                    <div>
                      <div className="callout callout-dark-header"><h4 className="header">Abnormal Behaviour</h4></div>
                      <div className="callout callout-dark">
                      <WeatherForm onSearch={this.handleSearch}/>
                      {renderMessage()}
                      {renderError()}
                      </div>
                    </div>

                  </div>

                  <div className="columns medium-3">
                    <div className="callout callout-dark-header"><h4 className="header">Notifications</h4></div>
                    <div className="callout callout-dark">
                      <Notifications/>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className = "large-offset-3 columns large-9">
                    <div className="callout callout-dark-header"><h4 className="header">All Sensors</h4></div>
                    <div className="callout callout-dark">
                      <Tableaux data={this.props.bfg} />
                    </div>
                  </div>
                  </div>
            </div>
        );
    }
});

module.exports = Dashboard;
