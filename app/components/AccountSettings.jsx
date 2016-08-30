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

    reveal(clickTarget, revealTarget) {

      $('#' +clickTarget).click(function(){
        $('#' +revealTarget).slideDown("slow");
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
                    <div className="profile wrapper" style={{
                        'color': '#000'
                    }}>
                        <div className="row">
                            <div className="columns large-2">Name</div>
                            <div className="columns large-5">{this.state.userDisplayName}</div>
                            <div className="columns large-5">
                                <a id="triggerNamePanel" onClick={this.reveal('triggerNamePanel', 'namePanel')}>Edit</a>
                            </div>
                        </div>

                        <div className="row" id="namePanel">
                            <div className="input-group">
                                <span className="input-group-label">Display Name</span>
                                <input className="input-group-field" type="text"/>
                                <div className="input-group-button">
                                    <input type="submit" onClick={this.onUpdateDisplayName} className="button hollow" value="Submit"/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="columns large-2">Email</div>
                            <div className="columns large-5">{this.state.email}</div>
                            <div className="columns large-5">
                                <a id="triggerEmailPanel" onClick={this.reveal('triggerEmailPanel', 'emailPanel')}>Edit</a>
                            </div>
                        </div>
                        <div className="row" id="emailPanel">
                            <form>
                                <div className="row">
                                    <div className="medium-6 columns">
                                        <label>Input Label
                                            <input type="text" placeholder=".medium-6.columns"/>
                                        </label>
                                    </div>
                                    <div className="medium-6 columns">
                                        <label>Input Label
                                            <input type="text" placeholder=".medium-6.columns"/>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="row">
                            <div className="columns large-2">Email Verified?</div>
                            <div className="columns large-5">{this.state.emailVerified}</div>
                            <div className="columns large-5">
                                <a href="" onClick={this.verifyEmail}>Verify email</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

module.exports = AccountSettings;
