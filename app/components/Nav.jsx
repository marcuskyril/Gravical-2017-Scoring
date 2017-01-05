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
        console.log("Logging out.");

        firebase.auth().signOut().then(() => {
            console.log('Logged out!');
        });
    }

    render() {
        return (
            <div className="top-bar">
                <IndexLink to="/" className="top-bar-title" activeClassName="active" activeStyle={{
                    color: '#f8f8f8'
                }}>Gravical 2017</IndexLink>
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

// <div className="top-bar-right">
//     <ul className="dropdown menu" data-dropdown-menu>
//         <li>
//             <Link to="/" activeClassName="active"><FontAwesome name='cog'/></Link>
//             <ul className="menu vertical">
//                 <li>
//                     <Link to="/accountSettings" activeClassName="active" activeStyle={{
//                         color: '#222`'
//                     }}>Admin</Link>
//                 </li>
//                 <li>
//                     <a onClick={this.onLogout}>Log Out</a>
//                 </li>
//             </ul>
//         </li>
//     </ul>
// </div>
