var React = require('react');
var Nav = require('Nav');
var SensorDetails = require('SensorDetails');
var Dashboard = require('Dashboard');

class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            overall: [],
            bfg: [],
            notifications: []
        }
    }

    componentDidMount() {
        $(document).foundation();

        var that = this;

        var conn1 = new ab.Session('ws://52.74.119.147:9000', function() {
            conn1.subscribe('', function(topic, data) {
                console.log(data);
                that.setState({overall: data});

            });
        }, function() {
            console.warn('WebSocket connection closed: Building data not available');
        }, {'skipSubprotocolCheck': true});

        var conn2 = new ab.Session('ws://52.74.119.147:9001', function() {
            conn2.subscribe('', function(topic, data) {

                that.setState({
                    bfg: data
                });
            });
        }, function() {
            console.warn('WebSocket connection closed: BFG data not available');
        }, {'skipSubprotocolCheck': true});

        var conn3 = new ab.Session('ws://52.74.119.147:9002', function() {
            conn3.subscribe('', function(topic, data) {

              console.log("main notifications data: ", data);

                that.setState({
                    notifications: data
                });
            });
        }, function() {
            console.warn('WebSocket connection closed: Notification data not available');
        }, {'skipSubprotocolCheck': true});

    }

    render() {
        console.log("main render: ", this.state.notifications);
        var iframeLink = "./test.html?";

        return (
            <div>
                <div className="off-canvas-wrapper">
                    <div className="off-canvas-wrapper-inner" data-off-canvas-wrapper>
                        <div className="off-canvas position-right" data-position="right" id="offCanvas" data-off-canvas style={{padding: 0}}>
                            <div id="sensorDetails"></div>
                            <iframe id="sensorDetailsIFrame" src={iframeLink} width="350px" height="99%"></iframe>
                        </div>

                        <div className="off-canvas-content" data-off-canvas-content>
                            <Nav/>

                            <div className="row">
                                <div className="columns medium-12 large 12">
                                  <Dashboard overall={this.state.overall} bfg={this.state.bfg} notifications={this.state.notifcations}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

module.exports = Main;
