var React = require('react');
var Nav = require('Nav');
var SensorDetails = require('SensorDetails');
var Dashboard = require('Dashboard');
import firebase from 'app/firebase/';
var toastr = require('toastr');

class Main extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        overall: [],
        bfg: [],
        notifications: [],
        currentTime: '',
        userDisplayName: ''
    }
}

componentDidMount() {
    $(document).foundation();
    var that = this;

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            that.setState({userDisplayName: user.displayName});
        }
    }, function(error) {
        console.warn(Error);
    });

    var conn1 = new ab.Session('ws://52.74.119.147:9000', function() {
        conn1.subscribe('', function(topic, data) {
            console.log(data);

            var timestamp = new Date().toLocaleString();
            console.log("now: ", timestamp);

            that.setState({overall: data, currentTime: timestamp});

        });
    }, function() {
        console.warn('WebSocket connection closed: Building data not available');
    }, {'skipSubprotocolCheck': true});

    var conn2 = new ab.Session('ws://52.74.119.147:9001', function() {
        conn2.subscribe('', function(topic, data) {

            var timestamp = new Date().toLocaleString();
            console.log("now: ", timestamp);

            that.setState({bfg: data, currentTime: timestamp});
        });
    }, function() {
        console.warn('WebSocket connection closed: BFG data not available');
    }, {'skipSubprotocolCheck': true});

    var conn3 = new ab.Session('ws://52.74.119.147:9002', function() {
        conn3.subscribe('', function(topic, data) {

            console.log("main notifications data: ", data);

            var timestamp = new Date().toLocaleString();
            console.log("now: ", timestamp);

            that.setState({notifications: data, currentTime: timestamp});
        });
    }, function() {
        console.warn('WebSocket connection closed: Notification data not available');
    }, {'skipSubprotocolCheck': true});

}

render() {
    console.log("main render: ", this.state.notifications);
    var iframeLink = "./test.html?";
    console.log("userDisplayName in main: ", this.state.userDisplayName);

    return (
        <div>
            <div className="off-canvas-wrapper">
                <div className="off-canvas-wrapper-inner" data-off-canvas-wrapper>
                    <div className="off-canvas position-right" data-position="right" id="offCanvas" data-off-canvas style={{
                        padding: 0
                    }}>
                        <div id="sensorDetails"></div>
                        <iframe id="sensorDetailsIFrame" src={iframeLink} width="350px" style={{
                            border: "none"
                        }} height="99%"></iframe>
                    </div>

                    <div className="off-canvas-content" data-off-canvas-content>
                        <Nav timestamp={this.state.currentTime}/>

                        <div className="row">
                            <div className="columns medium-12 large 12">
                                <Dashboard displayName={this.state.userDisplayName} overall={this.state.overall} bfg={this.state.bfg} notificationData={this.state.notifcations}/>
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
