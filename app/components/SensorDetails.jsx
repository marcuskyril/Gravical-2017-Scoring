var React = require('react');
var axios = require('axios');
var FontAwesome = require('react-fontawesome');

class SensorDetails extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      mac_address: '',
      building_name: '',
      building_level: '',
      area_id: '',
      CPU_usage: '',
      days: '',
      flapping: '',
      hours: '',
      last_reboot: '',
      mins: '',
      ram: '',
      status: '',
      storage: '',
      temperature: '',
      uptime_percentage: '',
      process1name: '',
      process1value: '',
      process2name: '',
      process2value: '',
      process3name: '',
      process3value: '',
      process4name: '',
      process4value: '',
      process5name: '',
      process5value: '',
    };
  }

  componentDidMount() {
    var baseUrl = 'http://52.74.119.147/PisaSchitt/websocket-functions/0-sample-generators/get-sensor-info-sample.php';
    axios.get(baseUrl).then(function(res) {
      var res = res.data;

      console.log("sensor data", res);
      console.log('process! ',res.top_5_processes["1"].process);
      console.log('usage! ',res.top_5_processes["1"].usage);

      this.setState({
        mac_address: res.mac_address,
        building_name: res.building_name,
        building_level: res.building_level,
        area_id: res.area_id,
        CPU_usage: res.cpu,
        days: res.days,
        flapping: res.flapping,
        hours: res.hours,
        last_reboot: res.last_reboot,
        mins: res.mins,
        ram: res.ram,
        status: res.status,
        storage: res.storage,
        temperature: res.temperature,
        uptime_percentage: res.uptime_percentage
      })

      console.log("ugh", barChartData[0].values[0].x);

      barChartData[0].values[0].x = res.top_5_processes["1"].process;
      barChartData[0].values[1].x = res.top_5_processes["2"].process;
      barChartData[0].values[2].x = res.top_5_processes["3"].process;
      barChartData[0].values[3].x = res.top_5_processes["4"].process;
      barChartData[0].values[4].x = res.top_5_processes["5"].process;

      barChartData[0].values[0].y = res.top_5_processes["1"].usage;
      barChartData[0].values[1].y = res.top_5_processes["2"].usage;
      barChartData[0].values[2].y = res.top_5_processes["3"].usage;
      barChartData[0].values[3].y = res.top_5_processes["4"].usage;
      barChartData[0].values[4].y = res.top_5_processes["5"].usage;

    }.bind(this));
  }

  render() {
    return (
      <div className="sensor-details">
        <div className="header textAlignCenter">{this.state.mac_address}</div>
        <hr/>
        <div className="sub-header textAlignCenter" style={{marginTop: '-1rem'}}>{this.state.building_name}</div>
        <div className="sub-header textAlignCenter">{this.state.building_level}</div>
        <div className="sub-header textAlignCenter">{this.state.building_area}</div>

        <div className="header textAlignCenter">{this.state.status}</div>
        <div className="sub-header textAlignCenter">Since {this.state.hours}hrs, {this.state.mins}mins ({this.state.last_reboot})</div>
        <table className="sensor-details-table margin-top-md">
          <tbody>
            <tr>
              <td>
                <FontAwesome name='arrow-up'/> Uptime
              </td>
              <td>
                {this.state.uptime_percentage}%
              </td>
            </tr>
            <tr>
              <td>
                <FontAwesome name='fire'/> Temperature
              </td>
              <td>
                {this.state.temperature}&deg;C
              </td>
            </tr>
            <tr>
              <td>
                <FontAwesome name='hdd-o'/> CPU Usage
              </td>
              <td>
                {this.state.CPU_usage}%
              </td>
            </tr>
            <tr>
              <td>
                <FontAwesome name='database'/> Storage
              </td>
              <td>
                {this.state.storage}%
              </td>
            </tr>
            <tr>
              <td>
                <FontAwesome name='tachometer'/> RAM
              </td>
              <td>
                {this.state.ram}%
              </td>
            </tr>
            <tr>
              <td>
                <FontAwesome name='arrows-v'/> Flapping
              </td>
              <td>
                {this.state.flapping ? "true" : "false"}
              </td>
            </tr>
          </tbody>
        </table>

        <BarChart
        data={barChartData}
        width={290}
        height={375}
        margin={{top: 50, bottom: 50, left: 45, right: 0}}
        tooltipHtml={barToolTip}
        />

      <button className="button hollow expanded disabled">Reboot</button>
        <button className="button hollow expanded disabled">Pin to watch list</button>
      </div>
    );
  }
};

module.exports = SensorDetails;
