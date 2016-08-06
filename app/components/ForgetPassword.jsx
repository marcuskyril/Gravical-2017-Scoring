var React = require('react');

var ForgetPassword = React.createClass({

    onForgetPassword() {

      var inputEmail = this.refs.inputEmail.value;
      var {dispatch} = this.props;

      console.log("start login", inputEmail);

      dispatch(actions.startForgetPassword(inputEmail));
    },

    render: function() {
        return (
            <div>
                <div className="login-wrapper">
                    <div className="large-5 large-centered columns">
                        <div className="row">
                            <h3 className="page-title">Forget password</h3>
                        </div>
                        <div className="login-box">
                            <div className="row">
                                <div className="large-12 columns">
                                    <form method="POST">
                                        <div className="row">
                                            <div className="large-12 columns">
                                                <input type="text" name="inputEmail" ref="inputEmail" placeholder="Email"/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="large-12 large-centered columns">
                                                <button className="expanded button" onClick={this.onForgetPassword}>Send Email</button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <p>Error goes here.</p>
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

module.exports = ForgetPassword;
