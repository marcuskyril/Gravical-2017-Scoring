var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
var settingsAPI = require('settingsAPI');
var user = null;

class ConfirmationModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'action': this.props.action
        }
    }

    componentDidMount() {}

    launchConfirmationModal() {
        var assocArr = {
            'updateEmail': 'Update Email',
            'updateDisplayName': 'Update Display Name',
            'updatePassword': 'Update Password'
        }

        this.setState({
            'action': assoArr[this.props.action]
        });

        $('#confirmation-modal').foundation('open');
    }

    render() {

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
            emailVerified: '-',
            reportTiming: '-',
            emailRecipient: '-',
            flappingThreshold: '-'
        }
    }

    componentDidMount() {

        var that = this;

        that.setState({
            message: ""
        });

        firebase.auth().onAuthStateChanged(function(user) {

            if (user) {
                that.setState({userDisplayName: user.displayName, email: user.email, emailVerified: user.emailVerified});
            }
        }, function(error) {
            console.warn(error);
        });

        settingsAPI.retrieveCurrentSettings().then(function(response) {
            if(response.error) {
                console.log("Error", response.error);
            } else {
                // console.log("response", response);
                that.setState({
                    currentSettings: response
                });
            }
        });

    }

    reveal(clickTarget, revealTarget) {

        $('#' + clickTarget).click(function() {

            switch (revealTarget) {
                case "emailPanel":
                    $('.emailHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#considerationPeriodPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.nameHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .considerationPeriodHeader, .emailRecipientHeader').removeClass('panel-grey');
                    break;
                case "namePanel":
                    $('.nameHeader').addClass('panel-grey');
                    $('#emailPanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#considerationPeriodPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.emailHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .considerationPeriodHeader, .emailRecipientHeader').removeClass('panel-grey');
                    break;
                case "passwordPanel":
                    $('.passwordHeader').addClass('panel-grey');
                    $('#emailPanel').slideUp("slow");
                    $('#namePanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#considerationPeriodPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .dailyReportTimeHeader, .flappingDownsHeader, .considerationPeriodHeader, .emailRecipientHeader').removeClass('panel-grey');
                    break;
                case "dailyReportTimePanel":
                    $('.dailyReportTimeHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#emailPanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#considerationPeriodPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .passwordHeader, .flappingDownsHeader, .considerationPeriodHeader, .emailRecipientHeader').removeClass('panel-grey');
                    break;
                case "flappingDownsPanel":
                    $('.flappingDownsHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#emailPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#considerationPeriodPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .passwordHeader, .dailyReportTimeHeader, .considerationPeriodHeader, .emailRecipientHeader').removeClass('panel-grey');
                    break;
                case "considerationPeriodPanel":
                    $('.considerationPeriodHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#emailPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .emailRecipientHeader').removeClass('panel-grey');
                    break;
                case "emailRecipientPanel":
                    $('.emailRecipientHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#emailPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#considerationPeriodPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .considerationPeriodHeader').removeClass('panel-grey');
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

                that.setState({userDisplayName: displayName})

                $('#namePanel').slideUp();
                $('.nameHeader').removeClass('panel-grey');

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
                $('.emailHeader').removeClass('panel-grey');

                that.setState({email: inputEmail})

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
                    $('.passwordHeader').removeClass('panel-grey');

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

    onUpdateUniversalSettings(e) {
        e.preventDefault();

        var that = this;

        var reportTiming = this.refs.reportTiming.value;
        var emailRecipient = this.refs.emailRecipient.value;
        var flappingThreshold = this.refs.flappingThreshold.value;

        var currentSettings = that.state.currentSettings;
        var currentReportTiming = "";
        var currentEmailRecipient = "";
        var currentFlappingThreshold = "";
        if (currentSettings) {
            currentReportTiming = currentSettings.daily_notification_time;
            currentEmailRecipient = currentSettings.report_recipient;
            currentFlappingThreshold = currentSettings.flapping_threshold;
        }


        if (reportTiming == "") {
            reportTiming = currentReportTiming;
        }
        if (emailRecipient == "") {
            emailRecipient = currentEmailRecipient;
        }
        if (flappingThreshold == "") {
            flappingThreshold = currentFlappingThreshold;
        }

        settingsAPI.changeCurrentSettings(reportTiming, emailRecipient, flappingThreshold).then(function(response) {
            $('#settingsAPIMessage').show();
            if(response.error) {
                console.log("Error1", response.error);
                that.setState({
                    message: response.error
                });
            } else {
                console.log("response", response);
                that.setState({
                    message: response.message

                });

                that.refs.reportTiming.value = '';
                that.refs.emailRecipient.value = '';
                that.refs.flappingThreshold.value = '';

                $('#namePanel').slideUp("slow");
                $('#passwordPanel').slideUp("slow");
                $('#emailPanel').slideUp("slow");
                $('#dailyReportTimePanel').slideUp("slow");
                $('#flappingDownsPanel').slideUp("slow");
                $('#considerationPeriodPanel').slideUp("slow");
                $('#emailRecipientPanel').slideUp("slow");
                $('.emailHeader, .nameHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .considerationPeriodHeader, .emailRecipientHeader').removeClass('panel-grey');
            }

            setTimeout(function () {
                $('#settingsAPIMessage').fadeOut();
            }, 10000);
        });



        // refresh currentSettings
        settingsAPI.retrieveCurrentSettings().then(function(response) {
            if(response.error) {
                console.log("Error", response.error);
            } else {
                console.log("response", response);
                that.setState({
                    currentSettings: response
                });
            }
        });

    }

    render() {

        var that = this;

        var currentSettings = that.state.currentSettings;
        var currentReportTiming = "";
        var currentEmailRecipient = "";
        var currentFlappingThreshold = "";

        if (currentSettings) {
            currentReportTiming = currentSettings.daily_notification_time;
            currentEmailRecipient = currentSettings.report_recipient;
            currentFlappingThreshold = currentSettings.flapping_threshold;
        }

        var messageState = that.state.message;
        var message = "";
        if (messageState) {
            message = messageState;
        }

        return (
            <div className="margin-top-md">
                <div className="large-10 columns large-centered">
                    <div style={{marginBottom : '1.2rem'}}>
                        <div className="page-title">General Account Settings</div>
                        <div className="profile wrapper settings-wrapper" style={{
                            'color': '#000'
                        }}>

                            <div className="row nameHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Name</b>
                                </div>
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
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#namePanel').slideUp();
                                            $('.nameHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>

                            <div className="row emailHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Email</b>
                                </div>
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
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#emailPanel').slideUp();
                                            $('.emailHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>

                            <div className="row settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Email Verified?</b>
                                </div>
                                <div className="columns large-5">{this.state.emailVerified ? "true" : "false"}</div>
                                <div className="columns large-5">
                                    <a onClick={this.onVerifyEmail}>Verify Email</a>
                                </div>
                            </div>

                            <div className="row passwordHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Password</b>
                                </div>
                                <div className="columns large-5">
                                    <a id="triggerPasswordPanel" onClick={this.reveal('triggerPasswordPanel', 'passwordPanel')}>Update Password</a>
                                </div>
                            </div>

                            <div className="row" id="passwordPanel">
                                <form>
                                    <div className="row">
                                        <div className="medium-4 columns">
                                            <input type="password" ref="newPassword" placeholder="New password"/>
                                        </div>
                                        <div className="medium-4 columns">
                                            <input type="password" ref="confirmPassword" placeholder="Repeat password"/>
                                        </div>
                                        <button className="button" type="button" onClick={this.onUpdatePassword.bind(this)}>Update</button>
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#passwordPanel').slideUp();
                                            $('.passwordHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                    <div style={{marginBottom : '1.2rem'}}>
                        <div className="page-title">Reports</div>
                        <div className="profile wrapper settings-wrapper" style={{
                            'color': '#000'
                        }}>
                            <div className="row dailyReportTimeHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Daily Report Time</b>
                                </div>
                                <div className="columns large-5">{currentReportTiming}</div>
                                <div className="columns large-5">
                                    <a id="triggerDailyReportTimePanel" onClick={this.reveal('triggerDailyReportTimePanel', 'dailyReportTimePanel')}>Edit</a>
                                </div>
                            </div>

                            <div className="row" id="dailyReportTimePanel">
                                <form>
                                    <div style={{fontSize: '0.9rem'}}>Tell us when you'd like to receive your daily notification email! (Format: HH-MM)</div>
                                    <div className="row">
                                        <div className="medium-3 columns">
                                            <input type="text" ref="reportTiming" placeholder="HH-MM"/>
                                        </div>
                                        <button className="button" type="button" onClick={this.onUpdateUniversalSettings.bind(this)}>Update</button>
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#dailyReportTimePanel').slideUp();
                                            $('.dailyReportTimeHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>

                            <div className="row emailRecipientHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Email Recipient</b>
                                </div>
                                <div className="columns large-5">{currentEmailRecipient}</div>
                                <div className="columns large-5">
                                    <a id="triggerEmailRecipientPanel" onClick={this.reveal('triggerEmailRecipientPanel', 'emailRecipientPanel')}>Edit</a>
                                </div>
                            </div>

                            <div className="row" id="emailRecipientPanel">
                                <form>
                                    <div className="row">
                                        <div className="medium-6 columns">
                                            <input type="text" ref="emailRecipient" placeholder="Email Recipient"/>
                                        </div>
                                        <button className="button" type="button" onClick={this.onUpdateUniversalSettings.bind(this)}>Update</button>
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#emailRecipientPanel').slideUp();
                                            $('.emailRecipientHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                    <div style={{marginBottom : '1.2rem'}}>
                        <div className="page-title">Flapping</div>
                        <div className="profile wrapper settings-wrapper" style={{
                            'color': '#000'
                        }}>
                            <div className="row flappingDownsHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Threshold</b>
                                </div>
                                <div className="columns large-5">{currentFlappingThreshold}</div>
                                <div className="columns large-5">
                                    <a id="triggerFlappingDownsPanel" onClick={this.reveal('triggerFlappingDownsPanel', 'flappingDownsPanel')}>Edit</a>
                                </div>
                            </div>

                            <div className="row" id="flappingDownsPanel">
                                <form>
                                    <div className="row">
                                        <div className="medium-6 columns">
                                            <input type="text" ref="flappingThreshold" placeholder="Threshold"/>
                                        </div>
                                        <button className="button" type="button" onClick={this.onUpdateUniversalSettings.bind(this)}>Update</button>
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#flappingDownsPanel').slideUp();
                                            $('.flappingDownsHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>



                        </div>
                    </div>
                    <div className="statusText" id="settingsAPIMessage">
                        {message}
                    </div>
                </div>

            </div>

        );

        // <div className="row considerationPeriodHeader">
        //     <div className="columns large-2">
        //         <b className="settings-subheader">Consideration Period</b>
        //     </div>
        //     <div className="columns large-5">{this.state.userDisplayName}</div>
        //     <div className="columns large-5">
        //         <a id="triggerConsiderationPeriodPanel" onClick={this.reveal('triggerConsiderationPeriodPanel', 'considerationPeriodPanel')}>Edit</a>
        //     </div>
        // </div>
        //
        // <div className="row" id="considerationPeriodPanel">
        //     <form>
        //         <div className="row">
        //             <div className="medium-6 columns">
        //                 <input type="text" ref="displayName" placeholder={this.state.userDisplayName}/>
        //             </div>
        //             <button className="button" type="button" onClick={this.onUpdateDisplayName.bind(this)}>Update</button>
        //             <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
        //                 $('#considerationPeriodPanel').slideUp();
        //                 $('.considerationPeriodHeader').removeClass('panel-grey')
        //             }}>Cancel</button>
        //         </div>
        //     </form>
        // </div>
    }
};

module.exports = AccountSettings;

// onSubmit={(e) => onUpdatePassword.bind(this) }
// e.preventDefault();
