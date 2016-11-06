var React = require('react');
var Recharts = require('recharts');
var FontAwesome = require('react-fontawesome');
var retrieveHistoricalDataAPI = require('retrieveHistoricalDataAPI');
const {
    XAxis,
    Cell,
    YAxis,
    Legend,
    BarChart,
    Bar,
    AreaChart,
    Area,
    LineChart,
    Line,
    CartesianGrid,
    Tooltip,
    Brush,
    ResponsiveContainer
} = Recharts;

var colorMap = {
    "ok": "#006600",
    "warning": "#ffcc00",
    "danger": "#cc7a00",
    "down": "#990000",
    "no data": "#737373"
}

class HistoricalChart extends React.Component {

    constructor(props) {
        super(props);

        var d = new Date();
        d.setDate(d.getDate() - 6);

        var startDate = d.toISOString().substring(0, 10);
        var endDate = new Date().toISOString().substring(0, 10);

        this.state = {
            macAdd: props.params.macAddress,
            data: {
                cpu: null,
                ram: null,
                storage: null,
                network: null
            },
            isLoading: false,
            message: '',
            startDate: startDate,
            endDate: endDate,
            interval: 15
        }
    }

    componentDidMount() {

        $('#offCanvas').foundation('close', function(){
            console.log("Closed canvas");
        });

        this.setState({isLoading: true});
        window.scrollTo(0, 0);
        var {startDate, endDate, interval} = this.state;
        this.retrieveData(startDate, endDate, interval);
    }

    onSubmit() {

        var startDate = this.refs.startDate.value;
        var endDate = this.refs.endDate.value;
        var interval = parseInt(this.refs.interval.value);

        if (Date.parse(endDate) < Date.parse(startDate)) {
            this.setState({message: 'End date is before start date. Please try again.'});
        } else {
            this.setState({isLoading: true});
            console.log("holllerrrrrr", startDate, endDate, interval);
            this.retrieveData(startDate, endDate, interval);
        }
    }

    retrieveData(startDate, endDate, interval) {

        var {macAdd} = this.state;

        var that = this;

        $.when(retrieveHistoricalDataAPI.retrieveHistoricalChart(macAdd, startDate, endDate, interval, "cpu"), retrieveHistoricalDataAPI.retrieveHistoricalChart(macAdd, startDate, endDate, interval, "ram"), retrieveHistoricalDataAPI.retrieveHistoricalChart(macAdd, startDate, endDate, interval, "storage"), retrieveHistoricalDataAPI.retrieveHistoricalChart(macAdd, startDate, endDate, interval, "network")).then(function(cpuData, ramData, storageData, networkData) {

            that.setState({
                data: {
                    cpu: cpuData[0],
                    ram: ramData[0],
                    storage: storageData[0],
                    network: networkData[0]
                },
                isLoading: false,
                startDate: startDate,
                endDate: endDate,
                interval: interval
            });
        });
    }

    minimize(metric) {
      var pane = $('#'+metric);

      if(pane.css('display') === 'block') {
        pane.slideUp();
      } else {
        pane.slideDown();
      }
    }

    minimizeAll() {
        var panels = $('.callout-dark');

        if (panels.css('display') === 'block') {
            panels.slideUp();
        } else {
            panels.slideDown();
        }
    }

    render() {

        var {
            macAdd,
            isLoading,
            data,
            buildingName,
            startDate,
            endDate,
            interval,
            message
        } = this.state;

        var desc = `You are viewing historical data for ${macAdd} between ${startDate}
                        & ${endDate} at an interval of ${interval} minutes.`;

        var that = this;

        function renderContent() {
            if (isLoading) {

                return (
                    <div className="loader"></div>
                );

            } else {
                return (
                    <div>
                        <div>
                            <div className="margin-bottom-small" style={{
                                display: 'flex'
                            }}>
                                <div className="page-title">{macAdd}</div>
                                <button className="margin-left-small" onClick={that.minimizeAll}>
                                    <FontAwesome name='expand' style={{
                                        marginRight: '0.5rem'
                                    }}/>
                                    Show/Hide all
                                </button>
                            </div>
                            <form id="uptime-form" style={{
                                display: 'flex'
                            }}>
                                <label className="margin-right-tiny">Start Date
                                    <input type="date" name="startDate" ref="startDate"/>
                                </label>
                                <label className="margin-right-tiny">End Date
                                    <input type="date" name="endDate" ref="endDate"/>
                                </label>

                                <label className="margin-right-tiny">
                                    Interval
                                    <select ref="interval">
                                        <option value="30">30 mins</option>
                                        <option value="15">15 mins</option>
                                    </select>
                                </label>

                                <a className="button proceed expanded" style={{
                                    height: '40px',
                                    width: '100px',
                                    alignSelf: 'flex-end'
                                }} onClick={(e) => that.onSubmit()}>Go</a>
                            </form>

                            <div id="uptimeMessage"><UptimeMessage message={message}/></div>
                            <div className="margin-bottom-small">{desc}</div>

                            <hr/>
                        </div>

                        <div className="callout callout-dark-header">
                            <div className="page-title">CPU Usage</div>
                            <button onClick={() => that.minimize("cpu")} className="icon-btn-text-small">
                                <FontAwesome name='expand'/>
                            </button>
                        </div>

                        <div id="cpu" className="callout callout-dark">
                            <SimpleAreaChart data={data['cpu']}/>
                        </div>

                        <div className="callout callout-dark-header">
                            <div className="page-title">RAM Usage</div>
                            <button onClick={() => that.minimize("ram")} className="icon-btn-text-small">
                                <FontAwesome name='expand'/>
                            </button>
                        </div>

                        <div id="ram" className="callout callout-dark">
                            <SimpleAreaChart data={data['ram']}/>
                        </div>

                        <div className="callout callout-dark-header">
                            <div className="page-title">Storage</div>
                            <button onClick={() => that.minimize("storage")} className="icon-btn-text-small">
                                <FontAwesome name='expand'/>
                            </button>
                        </div>

                        <div id="storage" className="callout callout-dark">
                            <SimpleAreaChart data={data['storage']}/>
                        </div>

                        <div className="callout callout-dark-header">
                            <div className="page-title">Network</div>
                            <button onClick={() => that.minimize("network")} className="icon-btn-text-small">
                                <FontAwesome name='expand'/>
                            </button>
                        </div>

                        <div id="network" className="callout callout-dark">
                            <SimpleLineChart data={data['network']}/>
                        </div>
                    </div>
                );
            }
        }

        return (
            <div id="uptime-wrapper" className="margin-top-large">
                <div className="row" style={{
                    minHeight: '100vh'
                }}>
                    <div className="columns large-12">
                        {renderContent()}
                    </div>
                </div>
            </div>
        );
    }
}

// <SimpleLineChart dataUp={data['network_up'] dataDown={data['network_down']}}/>

class SimpleAreaChart extends React.Component {
    render() {
        var width = $('.row').width() * 0.95;

        return (
            <AreaChart syncId='chart' width={width} height={250} data={this.props.data} margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
            }}>
                <XAxis dataKey="timestamp" tickCount={7}/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Area connectNulls={true} type='monotone' dataKey='value' stroke='#006600' fill='#009900'/>
            </AreaChart>
        );
    }
}

const SimpleLineChart = React.createClass({
    render() {
        var width = $('.row').width() * 0.95;

        return (
            <LineChart syncId='chart' width={width} height={250} data={this.props.data} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}>
                <XAxis dataKey="name" tickCount={7}/>
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip/>
                <Legend/>
                <Line connectNulls={true} dot={false} type="monotone" dataKey="network_up" stroke="#006600" activeDot={{
                    r: 2
                }}/>
                <Line connectNulls={true} dot={false} type="monotone" dataKey="network_down" stroke="#990000" activeDot={{
                    r: 2
                }}/>
            </LineChart>
        );
    }
})

class UptimeMessage extends React.Component {
    render() {
        var message = this.props.message;
        // console.log("message from parent: ", message);

        return (
            <div className="statusText">{message}</div>
        );
    }
}

module.exports = HistoricalChart;

class CustomTooltip extends React.Component {

    getDetails(label) {

        var {external} = this.props;
        var timestamp = external[label]['timestamp'];
        var status = external[label]['status'];

        return (
            <div>
                <p className="label">{status}</p>
                <p className="desc">{timestamp}</p>
            </div>
        );
    }

    render() {
        const {active} = this.props;

        if (active) {
            const {payload, external, label} = this.props;

            return (
                <div className="custom-tooltip">
                    {this.getDetails(label)}
                </div>
            );
        }
        return null;
    }
};

CustomTooltip.propTypes = {
    type: React.PropTypes.string,
    payload: React.PropTypes.array,
    label: React.PropTypes.number
}
