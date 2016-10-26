var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
var user = null;

class AppSettings extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() { }

    render() {
        return (
            <div className="margin-top-md">
                <div className="large-8 columns large-centered">
                    <div className="page-title">App Settings</div>
                    <div className="profile wrapper" style={{
                        'color': '#000',
                        'minHeight': '500px'
                    }}>

                        <div className="row nameHeader">
                            <div className="columns large-2">
                                <b>Name</b>
                            </div>
                            <div className="columns large-5"></div>
                            <div className="columns large-5">
                                <a id="triggerNamePanel">Edit</a>
                            </div>
                        </div>

                        <div className="row" id="namePanel">
                            <form>
                                <div className="row">
                                    <div className="medium-6 columns">
                                        <input type="text" ref="displayName"/>
                                    </div>
                                    <button className="button" type="button">Update</button>
                                    <button className="button hollow button-cancel margin-left-tiny" type="button">Cancel</button>
                                </div>
                            </form>
                        </div>

                        <div className="row emailHeader">
                            <div className="columns large-2">
                                <b>Email</b>
                            </div>
                            <div className="columns large-5"></div>
                            <div className="columns large-5">
                                <a id="triggerEmailPanel">Edit</a>
                            </div>
                        </div>

                        <div className="row" id="emailPanel">
                            <form>
                                <div className="row">
                                    <div className="medium-6 columns">
                                        <input type="text" ref="newEmail"/>
                                    </div>
                                    <button className="button" type="button">Update</button>
                                    <button className="button hollow button-cancel margin-left-tiny" type="button">Cancel</button>
                                </div>
                            </form>
                        </div>

                        <div className="row">
                            <div className="columns large-2">
                                <b>Email Verified?</b>
                            </div>
                            <div className="columns large-5"></div>
                            <div className="columns large-5">
                                <a>Verify Email</a>
                            </div>
                        </div>

                        <div className="row passwordHeader">
                            <div className="columns large-2">
                                <b>Password</b>
                            </div>
                            <div className="columns large-5">
                                <a id="triggerPasswordPanel">Update Password</a>
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
                                    <button className="button" type="button">Update</button>
                                    <button className="button hollow button-cancel margin-left-tiny" type="button">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

module.exports = AppSettings;
