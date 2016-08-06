import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';
var FontAwesome = require('react-fontawesome');

var {Link, IndexLink} = require('react-router');

var Nav = React.createClass({
    componentDidMount: function() {
        $(document).foundation();
    },
    onLogout() {
        console.log("attempting logout");
        var {dispatch} = this.props;
        dispatch(actions.startLogout());
    },
    render: function() {
        return (
            <div className="top-bar">
                <div className="top-bar-title">
                      <IndexLink to="/" activeClassName="active" activeStyle={{
                          color: '#f8f8f8'
                      }}>Dashboard</IndexLink>
                </div>
                <div className="top-bar-right">
                    <ul className="dropdown menu" data-dropdown-menu>
                        <li>
                            Last refresh at 29/07/16 02:17
                            <FontAwesome name='refresh' spin style={{
                                textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)', marginLeft: '0.5rem'
                            }}/>
                        </li>

                        <li>
                            <Link to="/" activeClassName="active" activeStyle={{
                                color: '#222'
                            }}><FontAwesome name='bar-chart'/></Link>
                            <ul className="menu vertical">
                                <li>
                                    <a href="#">Uptime</a>
                                </li>
                                <li>
                                    <a href="#">CPU Usage</a>
                                </li>
                                <li>
                                    <a href="#">Temperature</a>
                                </li>
                                <li>
                                    <a href="#">RAM Usage</a>
                                </li>
                                <li>
                                    <a href="#">Storage</a>
                                </li>
                                <li>
                                    <a href="#">Network Speed</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link to="/" activeClassName="active" activeStyle={{
                                color: 'blue'
                            }}><FontAwesome name='cog'/></Link>
                            <ul className="menu vertical">

                                <li><Link to="/accountSettings" activeClassName="active" activeStyle={{
                                    color: '#222`'
                                }}>Update Profile</Link>
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
});

module.exports = Redux.connect()(Nav);
