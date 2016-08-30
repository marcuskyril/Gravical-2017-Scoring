import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';
var FontAwesome = require('react-fontawesome');

var {Link, IndexLink} = require('react-router');

class Nav extends React.Component {

    constructor(props) {
      super(props);
    }

    componentDidMount() {
        $(document).foundation();
    }

    onLogout() {
        console.log("attempting logout");
        var {dispatch} = this.props;
        dispatch(actions.startLogout());
    }

    render() {
        
        return (
          <div data-sticky-container>

            <div className="top-bar" data-sticky data-options="marginTop:0;" style={{"width" : "100%", "marginTop": 0}}>
                <div className="top-bar-title">
                      <IndexLink to="/" activeClassName="active" activeStyle={{
                          color: '#f8f8f8'
                      }}>sence | mitos</IndexLink>
                </div>
                <div className="top-bar-right">
                    <ul className="dropdown menu" data-dropdown-menu>
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
          </div>
        );
    }
};

module.exports = Redux.connect()(Nav);
