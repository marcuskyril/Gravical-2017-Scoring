var React = require('react');
var Nav = require('Nav');
var SensorDetails = require('SensorDetails');
var Dashboard = require('Dashboard');
import firebase from 'app/firebase/';
import { NotificationStack, Notification } from 'react-notification';
import { OrderedSet } from 'immutable';

class NotificationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: OrderedSet(),
      count: 0
    };

    this.removeNotification = this.removeNotification.bind(this);
  }

  removeNotification (count) {
    const { notifications } = this.state;
    this.setState({
      notifications: notifications.filter(n => n.key !== count)
    })
  }

  render () {

    const { notifications, count } = this.state;
    const id = notifications.size + 1;
    const newCount = count + 1;

    //console.log("hello from the other side: ", this.props.notificationData);
    //console.log("notification data", this.props.notificationData.mac, this.props.notificationData.problem);
    if(this.props.notificationData.mac) {
      this.setState({
        count: newCount,
        notifications: notifications.add({
          title: this.props.notificationData.mac,
          message: ` | ${this.props.notificationData.problem.status} | ${this.props.notificationData.timestamp.date}`,
          key: newCount,
          action: 'Dismiss',
          dismissAfter: 3000,
          onClick: () => this.removeNotification(newCount),
        })
      });
    }

    return (
      <div>
        <NotificationStack
          notifications={this.state.notifications.toArray()}
          onDismiss={notification => this.setState({
            notifications: this.state.notifications.delete(notification)
          })}
        />
      </div>
    );
  }
}

class Main extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        overall: [],
        bfg: [],
        notifications: [],
        sensorHealthOverviewV2: [],
        currentTime: '-',
        userDisplayName: '',
        notificationData: {}
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
        console.warn(error);
    });

    var conn1 = new ab.Session('ws://52.74.119.147:9000', function() {
        conn1.subscribe('', function(topic, data) {
            // console.log(data);

            var timestamp = new Date().toLocaleString();
            // console.log("now: ", timestamp);

            that.setState({overall: data, currentTime: timestamp});

        });
    }, function() {
        console.warn('WebSocket connection closed: Building data not available');
    }, {'skipSubprotocolCheck': true});

    var conn2 = new ab.Session('ws://52.74.119.147:9001', function() {
        conn2.subscribe('', function(topic, data) {

            var timestamp = new Date().toLocaleString();
            // console.log("now: ", timestamp);

            that.setState({bfg: data, currentTime: timestamp});
        });
    }, function() {
        console.warn('WebSocket connection closed: BFG data not available');
    }, {'skipSubprotocolCheck': true});

    var conn3 = new ab.Session('ws://52.74.119.147:9002', function() {
        conn3.subscribe('', function(topic, data) {

            // console.log("main notifications data: ", data);

            var timestamp = new Date().toLocaleString();

            console.log('this.refs', that.refs);

            if(data.length > 0) {
              data.forEach(function(notificationData) {
                // console.log("notificationMessage", notificationData);
                  that.setState({
                    notificationData: notificationData
                  })
              });
            }

            that.setState({notifications: data, currentTime: timestamp});

        });
    }, function() {
        console.warn('WebSocket connection closed: Notification data not available');
    }, {'skipSubprotocolCheck': true});


    var conn4 = new ab.Session('ws://52.74.119.147:9003', function() {
        conn4.subscribe('', function(topic, data) {

            console.log("SensorHealthOverviewV2 data: ", data);

            var timestamp = new Date().toLocaleString();

            that.setState({sensorHealthOverviewV2: data, currentTime: timestamp});

        });
    }, function() {
        console.warn('WebSocket connection closed: sensorHealthOverviewV2 data not available');
    }, {'skipSubprotocolCheck': true});

}

render() {
    console.log("render: sensorHealthOverviewV2: ", this.state.sensorHealthOverviewV2);
    var iframeLink = "./offCrepe.html?";

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
                              <Dashboard timestamp={this.state.currentTime}
                                          displayName={this.state.userDisplayName}
                                          overall={this.state.overall}
                                          bfg={this.state.bfg}
                                          notificationData={this.state.notifcations}
                                          sensorHealthOverviewV2={this.state.sensorHealthOverviewV2}/>
                            </div>
                        </div>
                        <NotificationBar notificationData={this.state.notificationData}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
};

module.exports = Main;

// <Dashboard
//   {{React.cloneElement(this.props.children), {
//     timestamp: this.state.currentTime,
//     displayName: this.state.userDisplayName,
//     overall: this.state.overall,
//     bfg: this.state.bfg,
//     notificationData: this.state.notifications
//   }}}/>
