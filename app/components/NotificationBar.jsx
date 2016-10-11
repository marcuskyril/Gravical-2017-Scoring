var React = require('react');
import {NotificationStack, Notification} from 'react-notification';
import {OrderedSet} from 'immutable';

class NotificationBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: OrderedSet(),
            count: 0
        };

        this.removeNotification = this.removeNotification.bind(this);
    }

    componentDidMount() {
        var that = this;
        window.addEventListener('customEvent', function(e) {
            //   console.log("evt", e);
            //   alert('booyah', e);
            that.addProgressNotification(e.data);
        }, false);
    }

    removeNotification(count) {
        const {notifications} = this.state;
        this.setState({
            notifications: notifications.filter(n => n.key !== count)
        })
    }

    addProgressNotification(data) {
        //   const newCount = count + 1;

        var msgArr = {
            'addSensor': `Un momento por favor, adding ${data.macAdd} to ${data.building} ${data.location}`,
            'editSensor': `Un momento por favor, editing ${data.macAdd} at ${data.building} ${data.location}`,
            'pinSensor': `Un momento por favor, adding ${data.macAdd} to the Watch List`,
            'unpinSensor': `Un momento por favor, removing ${data.macAdd} from the Watch List`,
            'deleteSensor': `Un momento por favor, deleting ${data.macAdd}`
        }

        return this.setState({
            notifications: this.state.notifications.add({
                message: msgArr[data.type],
                key: data.macAdd,
                action: 'Dismiss',
                barStyle: {
                    backgroundColor: "#006600",
                    color: '#fff'
                },
                dismissAfter: 7000,
                onClick: () => this.removeNotification('some UID')
            })
        });
    }

    componentWillReceiveProps(nextProps) {

        var currentTime = this.props.timestamp;

        const {notifications, count} = this.state;
        const id = notifications.size + 1;
        const newCount = count + 1;

        if (nextProps.notificationData) {
            if (nextProps.notificationData !== this.props.notificationData && nextProps.notificationData.length > 0) {
                this.setState({
                    count: newCount,
                    notifications: notifications.add({
                        title: `${nextProps.notificationData[0].building} (${nextProps.notificationData[0].level}${nextProps.notificationData[0].id})`,
                        message: ` | ${nextProps.notificationData[0].problem.status} | ${nextProps.notificationData[0].timestamp.date}`,
                        key: newCount,
                        action: 'Dismiss',
                        dismissAfter: 5000,
                        onClick: () => this.removeNotification(newCount)
                    })
                });
            }
        }
    }

    render() {
        return (<NotificationStack notifications={this.state.notifications.toArray()} onDismiss={notification => this.setState({notifications: this.state.notifications.delete(notification)})}/>);
    }
}

module.exports = NotificationBar;
