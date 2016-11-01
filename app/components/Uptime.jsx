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

class SimpleBarChart extends React.Component {
    render() {

        console.log("puddle", this.props.uptimeData);

        // <BarChart width={width} height={40} data={this.props.uptimeData}
        //           margin={{top: 5, right: 30, left: 20, bottom: 5}} barGap={0} barCategoryGap={0}>
        //      <CartesianGrid strokeDasharray="3 3"/>
        //      <Tooltip content={<CustomTooltip external={this.props.uptimeData}/>}/>
        //      <Bar dataKey="value">
        //        {
        //          this.props.uptimeData.map((entry, index) =>(
        //           <Cell key={`cell=${index}`} stroke={colorMap[entry['status']]} fill={colorMap[entry['status']]} />
        //          ))
        //        }
        //      </Bar>
        // </BarChart>

        // <Tooltip coordinate={{ x: 1000, y: 100 }} content={
        //     <div style={{'backgroundColor':'#fff', 'padding':'10px', 'paddingBottom':'5px'}}>
        //         <div>{this.props.buildingName}</div>
        //
        //         <table id="glance-tooltip" style={{'minWidth':'100px'}}>
        //           <tbody>
        //             <tr style={{'color':'#008000'}}>
        //                 <td>ok</td><td>{this.props.ok}</td>
        //             </tr>
        //             <tr style={{'color':'#ffcc00'}}>
        //                 <td>warning</td><td>{this.props.warning}</td>
        //             </tr>
        //             <tr style={{'color':'#cc7a00'}}>
        //                 <td>danger</td><td>{this.props.danger}</td>
        //             </tr>
        //             <tr style={{'color':'#990000'}}>
        //                 <td>down</td><td>{this.props.down}</td>
        //             </tr>
        //             <tr style={{'color':'#737373'}}>
        //                 <td>no data</td><td>{this.props.noData}</td>
        //             </tr>
        //           </tbody>
        //         </table>
        //     </div>
        // }/>

        var width = $('.row').width() * 0.95;

        return (
            <ResponsiveContainer>
                <BarChart width={width} height={40} data={this.props.uptimeData} layout='vertical' margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}>
                    <XAxis hide={true} type="number"/>
                    <YAxis hide={true} dataKey="status" type="category"/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip content={< CustomTooltip external = {
                        this.props.uptimeData
                    } />}/>
                    <Bar dataKey="duration" isAnimationActive={false}>
                        {this.props.uptimeData.map((entry, index) => (<Cell key={`cell=${index}`} stroke={colorMap[entry['status']]} fill={colorMap[entry['status']]}/>))}
                    </Bar>
                </BarChart>

            </ResponsiveContainer>
        );
    }
};

class Uptime extends React.Component {

    constructor(props) {
        super(props);

        var d = new Date();
        d.setDate(d.getDate() - 6);

        var startDate = d.toISOString().substring(0, 10);
        var endDate = new Date().toISOString().substring(0, 10);

        this.state = {
            buildingName: props.params.buildingName,
            data: null,
            isLoading: false,
            message: '',
            startDate: startDate,
            endDate: endDate,
            interval: 15,
            totalDuration: 6 * 24
        }
    }

    componentDidMount() {

        this.setState({isLoading: true});

        window.scrollTo(0, 0);

        var {startDate, endDate, interval} = this.state;

        var startDateAlt = '2016-10-17';
        var endDateAlt = '2016-10-17';

        this.retrieveData(startDateAlt, endDateAlt, interval);
    }

    onSubmit() {

        var startDate = this.refs.startDate.value;
        var endDate = this.refs.endDate.value;
        var interval = parseInt(this.refs.interval.value);

        if (Date.parse(endDate) < Date.parse(startDate)) {
            this.setState({message: 'End date is before start date. Please try again.'});
        } else {
            this.setState({data: "", isLoading: true});

            this.retrieveData(startDate, endDate, interval);
        }
    }

    retrieveData(startDate, endDate, interval) {

        console.log("startdate", startDate);
        console.log("endDate", endDate);

        var sD = new Date(startDate);
        var eD = new Date(endDate);
        eD.setDate(eD.getDate() + 1);

        var tD = Math.abs(eD - sD) / 1000 / 60 / 60;
        console.log("TotalDuration:", tD);

        var that = this;
        retrieveHistoricalDataAPI.retrieveHistoricalDataAlt(that.state.buildingName, startDate, endDate, interval).then(function(response) {

            console.log("response", response);

            that.setState({data: response, isLoading: false, startDate: startDate, endDate: endDate, interval: interval});
        });
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

        // console.log("data", this.state.data);
        var {
            isLoading,
            data,
            buildingName,
            startDate,
            endDate,
            interval,
            message
        } = this.state;

        var that = this;

        function renderContent() {
            if (isLoading) {

                return (
                    <div className="loader"></div>
                );

            } else {
                return (
                    <div>

                        <form id="uptime-form">
                            <select className="page-title no-border" ref="buildingName">
                                <option value={buildingName}>{buildingName}</option>
                                <option value="">Test</option>
                            </select>
                            <button className="margin-left-small" onClick={that.minimizeAll}>
                                <FontAwesome name='expand' style={{
                                    marginRight: '0.5rem'
                                }}/>
                                Show/Hide all
                            </button>
                            <div style={{
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
                            </div>
                        </form>

                        <div id="uptimeMessage"><UptimeMessage message={message}/></div>
                        <div className="margin-bottom-small">You are viewing historical data for {buildingName}
                            between {startDate}
                            & {endDate}
                            at an interval of {interval}
                            minutes.</div>

                        <hr/>
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
                        <UptimeList data={this.state.data}/>
                    </div>
                </div>
            </div>
        );
    }
}

class UptimeMessage extends React.Component {
    render() {
        var message = this.props.message;

        return (
            <div className="statusText">{message}</div>
        );
    }
}

class UptimeList extends React.Component {
    render() {
        var dataList = this.props.data;
        var rows = [];

        for (var level in dataList) {

            console.log("level", level);
            if (dataList.hasOwnProperty(level)) {

                var sensorsOnLevel = dataList[level];
                rows.push(<SensorList key={level} level={level} data={sensorsOnLevel}/>);
            }
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class SensorList extends React.Component {

    minimize(level) {
        var pane = $('#' + level);

        if (pane.css('display') === 'block') {
            pane.slideUp();
        } else {
            pane.slideDown();
        }
    }

    render() {
        var sensorsOnLevel = this.props.data;
        var rows = [];
        var currentLevel = `Level ${this.props.level}`

        for (var sensor in sensorsOnLevel) {
            if (sensorsOnLevel.hasOwnProperty(sensor)) {
                var sensor = sensorsOnLevel[sensor];
                var mac = sensor["mac"];
                var building = sensor["building"];
                var level = sensor["level"];
                var id = sensor["id"];
                var data = sensor["data"];
                rows.push(<SimpleBarChart key={mac} mac={mac} id={id} level={level} uptimeData={data}/>);
            }
        }

        return (
            <div key={this.props.level} className="margin-bottom-md">
                <div className="callout callout-dark-header">
                    <div className="page-title">{currentLevel}</div>
                    <button onClick={() => this.minimize(this.props.level)} className="icon-btn-text-small">
                        <FontAwesome name='expand'/>
                    </button>
                </div>
                <div key={this.props.level} id={this.props.level} className="callout callout-dark">
                    {rows}
                </div>
            </div>
        );
    }
}

module.exports = Uptime;

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
