var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';

var user = null;

class AccountSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userDisplayName: '-',
            email: '-',
            emailVerified: '-'
        }
    }

    componentDidMount() {
        var that = this;

        firebase.auth().onAuthStateChanged(function(user) {

            if (user) {
                that.setState({userDisplayName: user.displayName, email: user.email, emailVerified: user.emailVerified});
            }
        }, function(error) {
            console.warn(error);
        });
    }

    onUpdateDisplayName(e) {

        e.preventDefault();

        var displayName = this.refs.displayName.value;
        var {dispatch} = this.props;

        console.log("start login", displayName);

        user = firebase.auth().currentUser;

        if (user != null) {
            user.updateProfile({displayName: displayName}).then(function() {
                alert('New display name: ' + user.displayName);
            }, function(error) {
                alert('Alamak ' + error);
            });
        }

    }

    onUpdateEmail(e) {

        e.preventDefault();

        var newEmail = this.refs.newEmail.value;
        var {dispatch} = this.props;

        console.log("start update email", newEmail);

        user = firebase.auth().currentUser;

        if (user != null) {
            user.updateEmail(inputEmail).then(function() {
                alert('Email updated!');
            }, function(error) {
                alert('Alamak ' + error);
            });
        }
    }

    onUpdatePassword(e) {
        e.preventDefault();

        var newPassword = this.refs.newPassword.value;
        var confirmPassword = this.refs.confirmPassword.value;

        console.log("start update password");

        user = firebase.auth().currentUser;

        if (user != null && user) {

            if (newPassword === confirmPassword) {
                user.updatePassword(confirmPassword).then(function() {
                    alert('Password changed!');
                }, function(error) {
                    alert('Alamak! ' + error);
                });
            } else {
                alert('Passwords do not match');
            }
        }
    }

    render() {
        return (
            <div className="margin-top-md">
                <div className="large-8 columns large-centered">
                    <div className="header">General Account Settings</div>
                    <hr/>
                    <div className="profile wrapper" style={{'color':'#000'}}>
                      <div className="row">
                          <div className="columns large-2">Name</div>
                          <div className="columns large-5">{this.state.userDisplayName}</div>
                          <div className="columns large-5">Edit</div>
                      </div>
                      <div className="row">
                          <div className="columns large-2">Email</div>
                          <div className="columns large-5">{this.state.email}</div>
                          <div className="columns large-5">Edit</div>
                      </div>
                      <div className="row">
                          <div className="columns large-2">Email Verified?</div>
                          <div className="columns large-5">{this.state.emailVerified}</div>
                          <div className="columns large-5">Verify email</div>
                      </div>
                    </div>
                </div>
            </div>
        );
    }
};

module.exports = AccountSettings;
