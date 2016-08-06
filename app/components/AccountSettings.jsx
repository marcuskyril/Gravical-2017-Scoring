var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';

var user = null;

var AccountSettings = React.createClass({

  onUpdateDisplayName(e) {

    e.preventDefault();

    var displayName = this.refs.displayName.value;
    var {dispatch} = this.props;

    console.log("start login", displayName);

    user = firebase.auth().currentUser;

    if (user != null) {
        user.updateProfile({
            displayName: displayName
        }).then(function() {
            alert('New display name: ' +user.displayName);
        }, function(error) {
            alert('Alamak ' +error);
        });
    }

  },

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
            alert('Alamak ' +error);
        });
    }
  },

  onUpdatePassword(e) {
    e.preventDefault();

    var newPassword = this.refs.newPassword.value;
    var confirmPassword = this.refs.confirmPassword.value;

    console.log("start update password");

    user = firebase.auth().currentUser;

    if (user != null && user) {

      if(newPassword === confirmPassword) {
        user.updatePassword(confirmPassword).then(function() {
            alert('Password changed!');
        }, function(error) {
            alert('Alamak! '+error);
        });
      } else {
        alert('Passwords do not match');
      }
    }
  },

  render: function() {
    return (
      <div className="large-5 large-centered columns" id="updateForm">
            <div className="row">
                <h3 className="header textAlignCenter">Update Profile</h3>
            </div>
            <div className="row">
                <div className="row">
                    <br/>
                    <h3 className="header">Personal Particulars</h3>
                    <hr/>
                </div>

                <form>
                  <div className="row">
                      <div className="small-4 large-4 columns">
                          Display name:
                      </div>
                      <div className="large-8 small-8 columns">
                          <input type="text" ref="displayName" name="displayName" />
                      </div>
                  </div>
                  <div className="row">
                      <div className="large-4 small-4 columns"></div>
                      <div className="large-8 small-8 columns">
                          <button className="expanded button" onClick={this.onUpdateDisplayName}>Update</button>
                      </div>
                  </div>
                </form>


                <div className="row">
                    <br/>
                    <h3 className="header">Email</h3>
                    <hr/>
                </div>
                <div className="row">
                    <div className="small-4 large-4 columns">
                        New Email:
                    </div>
                    <div className="large-8 small-8 columns">
                        <input type="text" ref="newEmail" name="newemail" />
                    </div>
                </div>
                <div className="row">
                    <div className="large-4 small-4 columns"></div>
                    <div className="large-8 small-8 columns">
                        <button className="expanded button" onClick={this.onUpdateEmail}>Update</button>
                    </div>
                </div>

                <div className="row">
                    <br/>
                    <h3 className="header">Password</h3>
                    <hr/>
                </div>
                <form>
                  <div className="row">
                      <div className="small-4 large-4 columns">
                          New Password:
                      </div>
                      <div className="large-8 small-8 columns">
                          <input type="password" ref="newPassword" name="newpassword1" />
                      </div>
                  </div>
                  <div className="row">
                      <div className="small-4 large-4 columns">
                          Confirm Password:
                      </div>
                      <div className="large-8 small-8 columns">
                          <input type="password" ref="confirmPassword" name="newpassword2" />
                      </div>
                  </div>
                  <div className="row">
                      <div className="large-4 small-4 columns"></div>
                      <div className="large-8 small-8 columns">
                          <button className="expanded button" onClick={this.onUpdatePassword}>Update</button>
                      </div>
                  </div>
                </form>
            </div>
        </div>
    );
  }
});

module.exports = AccountSettings;
// export default Redux.connect()(AccountSettings);
