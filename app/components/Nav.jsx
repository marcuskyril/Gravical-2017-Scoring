import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';
var FontAwesome = require('react-fontawesome');
import firebase, {firebaseRef} from 'app/firebase/';
var {Link, IndexLink} = require('react-router');

class Nav extends React.Component {

    constructor(props) {
        super(props);
    }

    onLogout() {
        console.log("attempting logout");
        // var {dispatch} = this.props;
        // dispatch(actions.startLogout());
        firebase.auth().signOut().then(() => {
            console.log('Logged out!');
        });
    }

    render() {

        return (

                    <div className="top-bar">
                        <div className="top-bar-title">
                            <IndexLink to="/" activeClassName="active" activeStyle={{
                                color: '#f8f8f8'
                            }}>sence | mitos</IndexLink>
                        </div>
                        <div className="top-bar-right">
                            <ul className="dropdown menu" data-dropdown-menu>
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
                                            <Link to="/" activeClassName="active" activeStyle={{
                                                color: '#222`'
                                            }}>Sensor Log</Link>
                                        </li>
                                        <li>
                                            <a href="#">Configure Settings</a>
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

module.exports = Redux.connect()(Nav);
