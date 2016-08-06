var React = require('react');
var SensorHealthOverview = require('SensorHealthOverview');
var piSensorOverview = require('piSensorOverview');

var Overview = React.createClass({

    render: function() {

        var {data} = this.state;

        function renderOverview() {
            return <SensorHealthOverview this.props.data={data}/>
        }

        return (
            <div>
                {renderOverview()}
            </div>
        );
    }
});

module.exports = Overview;
