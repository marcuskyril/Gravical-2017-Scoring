import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';
var FontAwesome = require('react-fontawesome');
import firebase, {firebaseRef} from 'app/firebase/';
var {Link, IndexLink} = require('react-router');
const HOST = 'http://119.81.104.46:4201/';

class Nav extends React.Component {

    constructor(props) {
        super(props);
    }

    launchTerminal() {
        document.getElementById('terminalIFrame').src = HOST;
        $('#terminal').foundation('open');
    }

    onLogout() {
        console.log("attempting logout");
        // var {dispatch} = this.props;
        // dispatch(actions.startLogout());
        firebase.auth().signOut().then(() => {
            console.log('Logged out!');
        });
    }

    // componentDidUpdate(prevProps) {
    //     console.log(prevProps);
    //     // var {currentTime, userId} = props;
    //     // // console.log("what this be?",this.props);
    //     // console.log("currentTime", currentTime);
    //     // console.log("userId", userId);
    // }

    render() {
        return (
            <div className="top-bar">
                <IndexLink to="/" className="top-bar-title" activeClassName="active" activeStyle={{
                    color: '#f8f8f8'
                }}>sence | mitos</IndexLink>
                <div className="top-bar-right">
                    <ul className="dropdown menu" data-dropdown-menu>
                        <li>
                          <a><FontAwesome name='terminal' onClick={this.launchTerminal.bind(this)}/></a>
                        </li>
                        <li>
                            <Link to="/" activeClassName="active" activeStyle={{
                                color: 'blue'
                            }}><FontAwesome name='cog'/></Link>
                            <ul className="menu vertical">

                                <li>
                                    <Link to="/accountSettings" activeClassName="active" activeStyle={{
                                        color: '#222`'
                                    }}>Update Profile</Link>
                                </li>
                                <li>
                                    <Link to="/notificationLog" activeClassName="active" activeStyle={{
                                        color: '#222`'
                                    }}>Notification Log</Link>
                                </li>
                                <li>
                                    <Link to="/actionLog" activeClassName="active" activeStyle={{
                                        color: '#222`'
                                    }}>Action Log</Link>
                                </li>
                                <li>
                                    <Link to="/accountSettings" activeClassName="active" activeStyle={{
                                        color: '#222`'
                                    }}>Account Settings</Link>
                                </li>
                                <li>
                                    <Link to="/downtimeScheduler" activeClassName="active" activeStyle={{
                                        color: '#222`'
                                    }}>Downtime Scheduler</Link>
                                </li>
                                <li>
                                    <a onClick={this.onLogout}>Log Out</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

        );
    }
};

function mapStateToProps(state, ownProps) {
    return {
        currentTime: state.currentTime,
        userId: state.userId
    }
}

module.exports = Redux.connect(mapStateToProps)(Nav);
