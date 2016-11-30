var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
var settingsAPI = require('settingsAPI');
var user = null;

const DEFAULT_VALUES = {
    reportTiming: '0800',
    emailRecipient: 'uat@gmail.com',
    maxDataGap: '30',
    sensorOfflineAllowance: '30',
    flappingThreshold: '5'
}

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
                                Cancel
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
            maxDataGap: '-',
            sensorOfflineAllowance: '-',
            flappingThreshold: '-',
            message: ''
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

        this.retrieveCurrentSettings();
    }

    restoreDefaultSettings() {
        var that = this;
        var {reportTiming, emailRecipient, maxDataGap, sensorOfflineAllowance} = DEFAULT_VALUES;

        // console.log("restoring", reportTiming, emailRecipient, maxDataGap, sensorOfflineAllowance);

        settingsAPI.updateReportSettings(reportTiming, emailRecipient, maxDataGap, sensorOfflineAllowance).then(function(response) {
            if(response.error) {
                console.log("error", response.error);
                that.setState({
                    message: response.error
                });
            } else {
                // console.log("response", response);
                that.setState({
                    message: response.message,
                    reportTiming,
                    emailRecipient,
                    maxDataGap,
                    sensorOfflineAllowance
                });
            }
        });
    }

    retrieveCurrentSettings() {

        var that = this;

        settingsAPI.retrieveCurrentSettings().then(function(response) {
            if(response.error) {
                console.log("Error", response.error);
            } else {
                // console.log("response", response);
                that.setState({
                    reportTiming: response.daily_notification_time,
                    emailRecipient: response.report_recipient,
                    sensorOfflineAllowance: response.sensor_offline_allowance,
                    maxDataGap: response.max_data_gap,
                    flappingThreshold: response.flapping_threshold
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
                    $('#sensorOfflineAllowancePanel').slideUp("slow");
                    $('#maxDataGapPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.nameHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .emailRecipientHeader, .sensorOfflineAllowanceHeader, .maxDataGapHeader').removeClass('panel-grey');
                    break;
                case "namePanel":
                    $('.nameHeader').addClass('panel-grey');
                    $('#emailPanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#sensorOfflineAllowancePanel').slideUp("slow");
                    $('#maxDataGapPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.emailHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .emailRecipientHeader, .sensorOfflineAllowanceHeader, .maxDataGapHeader').removeClass('panel-grey');
                    break;
                case "passwordPanel":
                    $('.passwordHeader').addClass('panel-grey');
                    $('#emailPanel').slideUp("slow");
                    $('#namePanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#sensorOfflineAllowancePanel').slideUp("slow");
                    $('#maxDataGapPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .dailyReportTimeHeader, .flappingDownsHeader, .emailRecipientHeader, .sensorOfflineAllowanceHeader, .maxDataGapHeader').removeClass('panel-grey');
                    break;
                case "dailyReportTimePanel":
                    $('.dailyReportTimeHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#emailPanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#elapsedDowntime').slideUp("slow");
                    $('#sensorOfflineAllowancePanel').slideUp("slow");
                    $('#maxDataGapPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .passwordHeader, .flappingDownsHeader, .emailRecipientHeader, .sensorOfflineAllowanceHeader, .maxDataGapHeader').removeClass('panel-grey');
                    break;
                case "flappingDownsPanel":
                    $('.flappingDownsHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#emailPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('#sensorOfflineAllowancePanel').slideUp("slow");
                    $('#maxDataGapPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .passwordHeader, .dailyReportTimeHeader, .emailRecipientHeader, .sensorOfflineAllowanceHeader, .maxDataGapHeader').removeClass('panel-grey');
                    break;
                case "emailRecipientPanel":
                    $('.emailRecipientHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#emailPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#sensorOfflineAllowancePanel').slideUp("slow");
                    $('#maxDataGapPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .sensorOfflineAllowanceHeader, .maxDataGapHeader').removeClass('panel-grey');
                    break;
                case "maxDataGapPanel":
                    $('.maxDataGapHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#emailPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('#sensorOfflineAllowancePanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .emailRecipientHeader, .sensorOfflineAllowanceHeader').removeClass('panel-grey');
                    break;
                case "sensorOfflineAllowancePanel":
                    $('.sensorOfflineAllowanceHeader').addClass('panel-grey');
                    $('#namePanel').slideUp("slow");
                    $('#passwordPanel').slideUp("slow");
                    $('#emailPanel').slideUp("slow");
                    $('#dailyReportTimePanel').slideUp("slow");
                    $('#flappingDownsPanel').slideUp("slow");
                    $('#emailRecipientPanel').slideUp("slow");
                    $('#maxDataGapPanel').slideUp("slow");
                    $('.emailHeader, .nameHeader, .passwordHeader, .dailyReportTimeHeader, .flappingDownsHeader, .emailRecipientHeader, .maxDataGapHeader').removeClass('panel-grey');
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

        // console.log("start update email", newEmail);

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

        // console.log("start update password");

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

    onUpdateReportTiming(e) {
        e.preventDefault();

        var that = this;
        var {emailRecipient, maxDataGap, sensorOfflineAllowance, maxDataGap} = this.state
        var reportTiming = this.refs.reportTiming.value;

        // console.log(emailRecipient, reportTiming, maxDataGap, sensorOfflineAllowance);

        settingsAPI.updateReportSettings(reportTiming, emailRecipient, maxDataGap, sensorOfflineAllowance).then(function(response) {
            if(response.error) {
                console.log("error", response.error);
                that.setState({
                    message: response.error
                });
            } else {
                // console.log("response", response);
                that.setState({
                    message: response.message,
                    reportTiming: reportTiming
                });

                that.refs.reportTiming.value = '';

                $('#dailyReportTimePanel').slideUp("slow");
                $('.dailyReportTimeHeader').removeClass('panel-grey');
            }
        });
    }

    onUpdateOfflineAllowance(e) {
        e.preventDefault();

        var that = this;
        var {reportTiming, emailRecipient, maxDataGap} = this.state
        var sensorOfflineAllowance = this.refs.sensorOfflineAllowance.value;

        settingsAPI.updateReportSettings(reportTiming, emailRecipient, maxDataGap, sensorOfflineAllowance).then(function(response) {
            if(response.error) {
                console.log("error", response.error);
                that.setState({
                    message: response.error
                });
            } else {
                // console.log("response", response);
                that.setState({
                    message: response.message,
                    sensorOfflineAllowance: sensorOfflineAllowance
                });

                that.refs.sensorOfflineAllowance.value = '';

                $('#sensorOfflineAllowancePanel').slideUp("slow");
                $('.sensorOfflineAllowanceHeader').removeClass('panel-grey');
            }
        });
    }

    onUpdateMaxDataGap(e) {
        e.preventDefault();

        var that = this;
        var {reportTiming, emailRecipient, sensorOfflineAllowance} = this.state
        var maxDataGap = this.refs.maxDataGap.value;

        // console.log(emailRecipient, reportTiming, maxDataGap, sensorOfflineAllowance);

        settingsAPI.updateReportSettings(reportTiming, emailRecipient, maxDataGap, sensorOfflineAllowance).then(function(response) {
            if(response.error) {
                console.log("error", response.error);
                that.setState({
                    message: response.error
                });
            } else {
                // console.log("response", response);
                that.setState({
                    message: response.message,
                    maxDataGap: maxDataGap
                });

                that.refs.maxDataGap.value = '';

                $('#maxDataGapPanel').slideUp("slow");
                $('.maxDataGapHeader').removeClass('panel-grey');
            }
        });
    }

    onUpdateEmailRecipient(e) {
        e.preventDefault();

        var that = this;
        var {reportTiming, maxDataGap, sensorOfflineAllowance, maxDataGap} = this.state
        var emailRecipient = this.refs.emailRecipient.value;

        // console.log(emailRecipient, reportTiming, maxDataGap, sensorOfflineAllowance);

        settingsAPI.updateReportSettings(reportTiming, emailRecipient, maxDataGap, sensorOfflineAllowance).then(function(response) {
            if(response.error) {
                console.log("error", response.error);
                that.setState({
                    message: response.error
                });
            } else {
                // console.log("response", response);
                that.setState({
                    message: response.message,
                    emailRecipient: emailRecipient
                });

                that.refs.emailRecipient.value = '';

                $('#emailRecipientPanel').slideUp("slow");
                $('.emailRecipientHeader').removeClass('panel-grey');
            }
        });
    }

    onUpdateFlappingThreshold(e) {
        e.preventDefault();

        var that = this;
        var flappingThreshold = this.refs.flappingThreshold.value;

        settingsAPI.updateFlappingSettings(flappingThreshold).then(function(response) {
            $('#settingsAPIMessage').show();

            if(response.error) {
                // console.log("Error1", response.error);
                that.setState({
                    message: response.error
                });
            } else {
                // console.log("response", response);
                that.setState({
                    message: response.message,
                    flappingThreshold: flappingThreshold
                });

                that.refs.flappingThreshold.value = '';

                $('#flappingDownsPanel').slideUp("slow");
                $('.flappingDownsHeader').removeClass('panel-grey');
            }
        });
    }

    render() {

        var that = this;
        var {reportTiming, emailRecipient, sensorOfflineAllowance, maxDataGap, flappingThreshold, message} = this.state;

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
                        <div className="page-title">Report Settings</div>
                        <div className="profile wrapper settings-wrapper">
                            <div className="row dailyReportTimeHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Daily Report Time</b>
                                </div>
                                <div className="columns large-5">{reportTiming}</div>
                                <div className="columns large-5">
                                    <a id="triggerDailyReportTimePanel" onClick={this.reveal('triggerDailyReportTimePanel', 'dailyReportTimePanel')}>Edit</a>
                                </div>
                            </div>

                            <div className="row" id="dailyReportTimePanel">
                                <form>
                                    <div className="row">
                                        <div className="medium-3 columns">
                                            <input type="text" ref="reportTiming" placeholder="HHMM"/>
                                        </div>
                                        <button className="button" type="button" onClick={this.onUpdateReportTiming.bind(this)}>Update</button>
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
                                <div className="columns large-5">{emailRecipient}</div>
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
                                        <button className="button" type="button" onClick={this.onUpdateEmailRecipient.bind(this)}>Update</button>
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#emailRecipientPanel').slideUp();
                                            $('.emailRecipientHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>

                            <div className="row sensorOfflineAllowanceHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Sensor Offline Allowance</b>
                                </div>
                                <div className="columns large-5">{sensorOfflineAllowance}</div>
                                <div className="columns large-5">
                                    <a id="triggerOfflineAllowanceHeader" onClick={this.reveal('triggerOfflineAllowanceHeader', 'sensorOfflineAllowancePanel')}>Edit</a>
                                </div>
                            </div>

                            <div className="row" id="sensorOfflineAllowancePanel">
                                <form>
                                    <div className="row">
                                        <div className="medium-6 columns">
                                            <input type="text" ref="sensorOfflineAllowance" placeholder="Sensor Offline Allowance"/>
                                        </div>
                                        <button className="button" type="button" onClick={this.onUpdateOfflineAllowance.bind(this)}>Update</button>
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#sensorOfflineAllowancePanel').slideUp();
                                            $('.sensorOfflineAllowanceHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>

                            <div className="row maxDataGapHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Maximum Data Gap</b>
                                </div>
                                <div className="columns large-5">{maxDataGap}</div>
                                <div className="columns large-5">
                                    <a id="triggerMaxDataGap" onClick={this.reveal('triggerMaxDataGap', 'maxDataGapPanel')}>Edit</a>
                                </div>
                            </div>

                            <div className="row" id="maxDataGapPanel">
                                <form>
                                    <div className="row">
                                        <div className="medium-6 columns">
                                            <input type="text" ref="maxDataGap" placeholder="Max Data Gap"/>
                                        </div>
                                        <button className="button" type="button" onClick={this.onUpdateMaxDataGap.bind(this)}>Update</button>
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#maxDataGapPanel').slideUp();
                                            $('.maxDataGapHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>

                            <div className="row flappingDownsHeader settings-subheader-container">
                                <div className="columns large-2">
                                    <b className="settings-subheader">Flapping Threshold</b>
                                </div>
                                <div className="columns large-5">{flappingThreshold}</div>
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
                                        <button className="button" type="button" onClick={this.onUpdateFlappingThreshold.bind(this)}>Update</button>
                                        <button className="button hollow button-cancel margin-left-tiny" type="button" onClick={() => {
                                            $('#flappingDownsPanel').slideUp();
                                            $('.flappingDownsHeader').removeClass('panel-grey')
                                        }}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <a onClick={this.restoreDefaultSettings.bind(this)}>Restore default values</a>

                    <ResponseMessage message={message}/>
                </div>
            </div>

        );
    }
};

module.exports = AccountSettings;

class ResponseMessage extends React.Component {
    render() {
        return(
            <div className="statusText">{this.props.message}</div>
        );
    }
}
