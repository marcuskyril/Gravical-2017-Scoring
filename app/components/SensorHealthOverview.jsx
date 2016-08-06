var React = require('react');
var PieChart = require('react-d3-components').PieChart;
var Griddle = require('griddle-react');

var myColors = ["#006600", "#cc7a00", "#990000", "#1a1b1b"];

var chartData = {
    label: 'Chart',
    values: [
        {
            x: 'OK',
            y: 1
        }, {
            x: 'Warning',
            y: 1
        }, {
            x: 'Danger',
            y: 1
        }, {
            x: 'Down',
            y: 1
        }
    ]
};

var tableData = [];

var tooltipPie = function(x, y) {
    return y.toString();
};

var sort = null;
var connection = null;

var SensorHealthOverview = React.createClass({
    getInitialState: function() {
        return {ok: 0, warning: 0, danger: 0, down: 0}
    },

    componentWillReceiveProps: function() {

        this.connection = new WebSocket('ws://52.74.119.147:9000/PHPMongo');

        if (this.connection != null) {
            setInterval(_ => {
                this.connection.send("OVERALL")
            }, 10000)

            this.connection.onmessage = evt => {

                const obj = JSON.parse(evt.data);

                //console.log(obj.data);

                tableData.push(obj.data);

                this.setState({ok: obj.data.ok, warning: obj.data.warning, danger: obj.data.danger, down: obj.data.down})

                //console.log('chartData', chartData.values[0]);

                chartData.values[0].y = obj.data.ok;
                chartData.values[1].y = obj.data.warning;
                chartData.values[2].y = obj.data.danger;
                chartData.values[3].y = obj.data.down;

            }
        } else {
            console.log("No connection.");
        }
    },

    render: function() {
        return (
            <div className="row">
              <div className="large-7 columns">
                <PieChart colorScale={d3.scale.ordinal().range(myColors)}
                  data={chartData}
                  width={400}
                  height={250}
                  tooltipHtml={tooltipPie}
                  margin={{
                    top: 10,
                    bottom: 50,
                    left: 0,
                    right: 10
                }}/>
                </div>
                <div className="large-5 columns">
                  <table className="overview-custom">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                          <tr>
                              <th>OK</th>
                              <td>{this.state.ok}</td>
                          </tr>
                          <tr>
                            <th>Warning</th>
                            <td>{this.state.warning}</td>
                          </tr>
                          <tr>
                            <th>Danger</th>
                            <td>{this.state.danger}</td>
                          </tr>
                          <tr>
                              <th>Down</th>
                              <td>{this.state.down}</td>
                            </tr>
                      </tbody>
                  </table>
                </div>
            </div>
        );
    }
});

module.exports = SensorHealthOverview;
