var React = require('react');
var dataList = [];

class BuildingList extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}

class LevelList extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}

class Level extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}


class SensorHealthOverviewV2 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList: this.props.bfg
        };
    }

    render() {


      var rows = [];

      return (
          <div>
            {rows}
          </div>
      );
    }
}

module.exports = SensorHealthOverviewV2;
