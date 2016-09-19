var React = require('react');
var Recharts = require('recharts');
const {XAxis, YAxis, Legend, BarChart, Bar, CartesianGrid, Tooltip, Brush, ResponsiveContainer} = Recharts;

const data = [
      {name: '9/19/2016, 10:00 PM', status: 1, fill: '#006600'},
      {name: '9/19/2016, 11:30 PM', status: 1, fill: '#006600'},
      {name: '9/19/2016, 11:00 PM', status: 1, fill: '#006600'},
      {name: '9/19/2016, 12:00 PM', status: 1, fill: '#006600'},
      {name: '9/19/2016, 12:30 PM', status: 1, fill: '#006600'},
      {name: '9/19/2016, 13:00 PM', status: 1, fill: '#006600'},
      {name: '9/19/2016, 13:30 PM', status: 1, fill: '#006600'},
      {name: '9/19/2016, 14:00 PM', status: 1, fill: '#000'},
      {name: '9/19/2016, 14:30 PM', status: 1, fill: '#006600'},
      {name: '9/19/2016, 15:00 PM', status: 1, fill: '#000'},
      {name: '9/19/2016, 15:30 PM', status: 1, fill: '#006600'},
      {name: '9/19/2016, 16:00 PM', status: 1, fill: '#000'},
      {name: '9/19/2016, 16:30 PM', status: 1, fill: '#006600'}
];

const data2 = [
  {name: '9/19/2016, 10:00 PM', status: 1, fill: '#000'},
  {name: '9/19/2016, 11:30 PM', status: 1, fill: '#000'},
  {name: '9/19/2016, 11:00 PM', status: 1, fill: '#000'},
  {name: '9/19/2016, 12:00 PM', status: 1, fill: '#000'},
  {name: '9/19/2016, 12:30 PM', status: 1, fill: '#000'},
  {name: '9/19/2016, 13:00 PM', status: 1, fill: '#000'},
  {name: '9/19/2016, 13:30 PM', status: 1, fill: '#006600'},
  {name: '9/19/2016, 14:00 PM', status: 1, fill: '#000'},
  {name: '9/19/2016, 14:30 PM', status: 1, fill: '#006600'},
  {name: '9/19/2016, 15:00 PM', status: 1, fill: '#000'},
  {name: '9/19/2016, 15:30 PM', status: 1, fill: '#006600'},
  {name: '9/19/2016, 16:00 PM', status: 1, fill: '#000'},
  {name: '9/19/2016, 16:30 PM', status: 1, fill: '#006600'}
];

class SimpleBarChart extends React.Component{
	render () {
  	return (
      <div className="margin-top-large">
        <div className="header">Uptime Shizz</div>
        <BarChart width={600} height={100} data={data} syncId='uptime'
                  margin={{top: 5, right: 30, left: 20, bottom: 5}} barGap={0} barCategoryGap={0}>
             <XAxis dataKey="name"/>
             <CartesianGrid strokeDasharray="3 3"/>
             <Tooltip/>
             <Bar dataKey="status" fill="#8884d8" />
             <Brush height={20}/>
        </BarChart>


      <BarChart width={600} height={75} data={data2} syncId='uptime'
                margin={{top: 5, right: 30, left: 20, bottom: 5}} barGap={0} barCategoryGap={0}>
         <XAxis dataKey="name"/>
         <CartesianGrid strokeDasharray="3 3"/>
         <Tooltip/>
         <Bar dataKey="status" fill="#8884d8" />
      </BarChart>
      </div>
    );
  }
};

class Uptime extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="uptime-wrapper" style={{height: '400px', width: '400px'}}>
        <SimpleBarChart />
      </div>
    );
  }
}

module.exports = Uptime;
