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
      dispatch(actions.startCreateAccount());
    },

    render() {
        return (
            <div className="login-wrapper">
                <div className="large-5 large-centered columns">
                  <div className="row">
                      <h3 className="page-title">LOG IN</h3>
                  </div>
                  <div className="callout callout-dark">
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
