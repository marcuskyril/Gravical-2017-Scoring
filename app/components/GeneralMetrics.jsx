var React = require('react');
var SensorStatus = require('SensorStatus');
var axios = require('axios');
var Griddle = require('griddle-react');

var dataList = [];

class LinkComponent extends React.Component{
  constructor(props) {
    super(props);
  }

  handleClick(data) {
    console.log("click", data);

  }

  render() {
    return (
        <a onClick={this.handleClick(this.props.data)} data-toggle="offCanvas">{this.props.data}</a>
    );
  }
};

const tableMetaData =  [
  {
    "columnName": "mac_address",
    "order": 1,
    "locked": false,
    "visible": true,
    "displayName": "Mac Address",
    "customComponent": LinkComponent
  },
  {
    "columnName": "building_name",
    "order": 2,
    "locked": false,
    "visible": true,
    "displayName": "Building"
  },
  {
    "columnName": "building_level",
    "order": 3,
    "locked": true,
    "visible": true,
    "displayName": "Level"
  },
  {
    "columnName": "area_id",
    "order": 4,
    "locked": true,
    "visible": true,
    "displayName": "Area ID"
  }
];

class NoDataComponent extends React.Component{
    constructor(props) {
      super(props);
    }

    render(){
      return (
        <div>
          <h1>No data is available</h1>
        </div>
      );
    }
};

class GeneralMetrics extends React.Component{

    constructor(props) {
      super(props);
      this.state = {
        dataList: []
      };
    }

    componentDidMount() {
        $(document).foundation();

        var baseUrl = 'http://52.74.119.147/PisaSchitt/websocket-functions/0-sample-generators/regionmall-sample.php?number=';
        var numRows = 30;
        axios.get(baseUrl+numRows).then(function(res) {

          var that = this;

          dataList = res.data;

          that.setState({
            dataList: dataList
          });

        }).catch(function(error) {
            console.log("Problem siol", error);
        }.bind(this));
    }

    render() {
        return (
            <div>
                <Griddle
                  results={dataList}
                  showFilter={true}
                  initialSort="building_name"
                  tableClassName="piOverviewTable"
                  columnMetadata={tableMetaData}/>
            </div>
        );
    }
}

module.exports = GeneralMetrics;
