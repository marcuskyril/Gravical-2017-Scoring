var React = require('react');

var WeatherMessage = ({temp, location}) => {
    return (
      <strong>It's {temp} in {location}.</strong>
    );
};

module.exports = WeatherMessage;
