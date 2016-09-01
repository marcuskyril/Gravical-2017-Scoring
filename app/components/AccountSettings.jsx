var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
var user = null;

class ConfirmationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'action': this.props.action
        }
    }

    launchConfirmationModal() {
        var assocArr = {
            'updateEmail': 'Update Email',
            'updateDisplayName': 'Update Display Name',
            'updatePassword': 'Update Password'
        }

        this.setState({
            'action': assoArr[this.props.action]
        });
        var modal = new Foundation.Reveal($('#confirmation-modal'));
        modal.open();
    }

    render() {

        // TO DO
        // update on click event
        // update error message on failure

        return (
            <div id="confirmation-modal" className="reveal tiny text-center" data-reveal="">
                <form>
                    <div className="row">
                        <div className="large-12 columns">
                            <div className="header">{this.state.action}</div>

                            <div className="header" style={{
                                color: '#990000'
                            }}>Do you want to proceed?</div>

                            <div id="deleteSensorMessage"><DeleteSensorMessage message={message}/></div>

                            <button className="button expanded">
                                Yes I do
                            </button>
                            <button id="closeDelete" className="button hollow expanded" data-close="">
                                Slow down, cowboy
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

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

        $('#' + clickTarget).click(function() {

            switch(revealTarget) {
              case "emailPanel":
                $('.emailHeader').addClass('panel-grey');
                $('#namePanel').slideUp("slow");
                $('#passwordPanel').slideUp("slow");
                break;
              case "namePanel":
                $('.nameHeader').addClass('panel-grey');
                $('#emailPanel').slideUp("slow");
                $('#passwordPanel').slideUp("slow");
                break;
              case "passwordPanel":
                $('.passwordHeader').addClass('panel-grey');
                $('#emailPanel').slideUp("slow");
                $('#namePanel').slideUp("slow");
                break;
              default:
                console.warn("Oh snap. Something went wrong.");
              break;
            }

            $('#' + revealTarget).slideDown("slow");
        });
    }

    onUpdateDisplayName(e) {

        e.preventDefault();

        var that = this;

        var displayName = this.refs.displayName.value;
        var {dispatch} = this.props;

        user = firebase.auth().currentUser;

        if (user != null) {
            user.updateProfile({displayName: displayName}).then(function() {
                alert('New display name: ' + user.displayName);

                that.setState({
                  userDisplayName: displayName
                })

                $('#namePanel').slideUp();

            }, function(error) {
                alert('Oh snap. ' + error);
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

                $('#emailPanel').slideUp();

                that.setState({
                  email: inputEmail
                })

            }, function(error) {
                alert('Oh snap. ' + error);
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

                    $('#passwordPanel').slideUp();

                }, function(error) {
                    alert('Oh snap. ' + error);
                });
            } else {
                alert('Passwords do not match');
            }
        }
    }

    onVerifyEmail(e) {
        e.preventDefault();

        user = firebase.auth().currentUser;

        if (user != null) {
            user.sendEmailVerification().then(function() {
                alert('Email sent!');

            }, function(error) {
                alert('Oh snap. ' + error);
            });
        }
    }

    render() {

        // TO DO
        // set padding for forms

        return (
            <div className="margin-top-md">
                <div className="large-8 columns large-centered">
                    <div className="page-title">General Account Settings</div>
                    <div className="profile wrapper" style={{
                        'color': '#000', 'minHeight': '500px'
                    }}>

                        <div className="row nameHeader">
                              <div className="columns large-2"><b>Name</b></div>
                              <div className="columns large-5">{this.state.userDisplayName}</div>
                              <div className="columns large-5">
                                  <a id="triggerNamePanel" onClick={this.reveal('triggerNamePanel', 'namePanel')}>Edit</a>
                              </div>
                        </div>

                        <div className="row" id="namePanel">
                            <form>
                                <div className="row">
                                    <div className="medium-6 columns">
                                        <input type="text" ref="displayName" placeholder={this.state.userDisplayName}/>
                                    </div>
                                    <button className="button" type="button" onClick={this.onUpdateDisplayName.bind(this)}>Update</button>
                                    <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {$('#namePanel').slideUp(); $('.nameHeader').removeClass('panel-grey')}}>Cancel</button>
                                </div>
                            </form>
                        </div>

                        <div className="row emailHeader">
                            <div className="columns large-2"><b>Email</b></div>
                            <div className="columns large-5">{this.state.email}</div>
                            <div className="columns large-5">
                                <a id="triggerEmailPanel" onClick={this.reveal('triggerEmailPanel', 'emailPanel')}>Edit</a>
                            </div>
                        </div>

                        <div className="row" id="emailPanel">
                              <form>
                                  <div className="row">
                                      <div className="medium-6 columns">
                                          <input type="text" ref="newEmail" placeholder={this.state.email}/>
                                      </div>
                                      <button className="button" type="button" onClick={this.onUpdateEmail.bind(this)}>Update</button>
                                      <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {$('#emailPanel').slideUp(); $('.emailHeader').removeClass('panel-grey')}}>Cancel</button>
                                  </div>
                              </form>
                        </div>

                        <div className="row">
                            <div className="columns large-2"><b>Email Verified?</b></div>
                            <div className="columns large-5">{this.state.emailVerified ? "true":"false" }</div>
                            <div className="columns large-5">
                                <a onClick={this.onVerifyEmail}>Verify Email</a>
                            </div>
                        </div>

                        <div className="row passwordHeader">
                            <div className="columns large-2"><b>Password</b></div>
                            <div className="columns large-5">
                                <a id="triggerPasswordPanel" onClick={this.reveal('triggerPasswordPanel', 'passwordPanel')}>Update Password</a>
                            </div>
                        </div>

                        <div className="row" id="passwordPanel">
                              <form>
                                  <div className="row">
                                      <div className="medium-4 columns">
                                          <input type="password" ref="newPassword" placeholder="*******"/>
                                      </div>
                                      <div className="medium-4 columns">
                                          <input type="password" ref="confirmPassword" placeholder="*******"/>
                                      </div>
                                      <button className="button" type="button" onClick={this.onUpdatePassword.bind(this)}>Update</button>
                                      <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {$('#passwordPanel').slideUp(); $('.passwordHeader').removeClass('panel-grey')}} >Cancel</button>
                                  </div>
                              </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

module.exports = AccountSettings;
