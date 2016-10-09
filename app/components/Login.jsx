
import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export var Login = React.createClass({
    onLogin(e) {

      e.preventDefault();

      var inputEmail = this.refs.inputEmail.value;
      var inputPassword = this.refs.inputPassword.value;
      var {dispatch} = this.props;

      console.log("start login", inputEmail);

      dispatch(actions.startLogin(inputEmail, inputPassword));
    },

    onCreateAccount() {
      var{dispatch} = this.props;
      console.log("Creating new account now");
      dispatch(actions.startCreateAccount());
    },

    render() {
        return (
            <div className="login-wrapper">
                <div className="large-5 large-centered columns">
                  <div className="row">
                      <div className="page-title">Log In</div>
                  </div>
                  <div className="callout callout-top-header">
                        <div className="row">
                            <div className="row">
                                <div className="large-12 columns">
                                    <form method="POST">
                                        <div className="row">
                                            <div className="large-12 columns">
                                                <input type="text" name="inputEmail" ref="inputEmail" placeholder="Email"/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="large-12 columns">
                                                <input type="password" name="inputPassword" ref="inputPassword" placeholder="Password"/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="large-12 large-centered columns">
                                                <button className="expanded button" onClick={this.onLogin}>Log In</button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="large-12 large-centered columns">
                                                <a href="#">Forgot your password?</a>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="large-12 large-centered columns">
                                                <a onClick={this.onCreateAccount}>Register a new account</a>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect()(Login);
