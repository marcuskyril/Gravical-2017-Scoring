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

  addNotification() {
    const { notifications, count } = this.state;
    const id = notifications.size + 1;
    const newCount = count + 1;
    if ((this.props.notificationMsg).length > 0) {
      return this.setState({
        count: newCount,
        notifications: notifications.add({
          message: `${id}. ${this.props.notificationMsg}`,
          key: newCount,
          action: 'Dismiss',
          dismissAfter: 3000,
          onClick: () => this.removeNotification(newCount),
        })
      });
    }
  }

  componentWillReceiveProps() {
    this.addNotification();
  }

  removeNotification (count) {
    const { notifications } = this.state;
    this.setState({
      notifications: notifications.filter(n => n.key !== count)
    })
  }

  render () {



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
        currentTime: '',
        userDisplayName: '',
        notificationMsg: ''
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

            if(data.length > 0) {
              data.forEach(function(notificationMessage) {
                console.log("notificationMessage", notificationMessage);
                  that.setState({
                    notificationMsg: notificationMessage.problem.status
                  })
              });
            }

            that.setState({notifications: data, currentTime: timestamp});

        });
    }, function() {
        console.warn('WebSocket connection closed: Notification data not available');
    }, {'skipSubprotocolCheck': true});

}

render() {
    console.log("main render: ", this.state.notifications);
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
                        <NotificationBar notificationMsg={this.state.notificationMsg}/>
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
