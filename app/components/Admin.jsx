var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
var FontAwesome = require('react-fontawesome');
var settingsAPI = require('settingsAPI');
var scoreAPI = require('scoreAPI');
var climberManagementAPI = require('climberManagementAPI');
var Select = require('react-select');
var user = null;

class Admin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userDisplayName: '-',
            email: '-',
            message: '',
            registerMessage: '',
            gender: '',
            categories: [],
            selectedCategory: '',
            currentDetail: 0,
            currentEvent: '-',
            numDetails: 0,
            hasEventStarted: false
        }

        this.selectCategory = this.selectCategory.bind(this);
    }

    componentDidMount() {

        this.retrieveCurrentEvent();
        this.retrieveCurrentDetail();
        this.retrieveCategories();
    }

    retrieveCurrentEvent() {
        var that = this;
        climberManagementAPI.getCurrentEvent().then(function(response){
            console.log("Current event", response);
            that.setState({
                currentEvent: response.message
            })
        });
    }

    retrieveCurrentDetail() {
        var that = this;
        climberManagementAPI.getCurrentDetail().then(function(response){
            console.log("Current detail", response);
            that.setState({
                currentDetail: parseInt(response.message)
            })
        });
    }

    retrieveCategories() {
        var that = this;

        scoreAPI.retrieveCategories().then(function(response) {

            var temp = [];

            for (var property in response) {
                if (response.hasOwnProperty(property)) {
                    var category = property;
                    temp.push({value: category, label: response[category]});
                }
            }

            that.setState({
                categories: temp
            });
        });
    }

    retrieveNumDetails(category) {

        var that = this;
        scoreAPI.retrieveDetails(category).then(function(response){

            that.setState({
                numDetails: response['num_of_details']
            })
        });
    }

    selectCategory(val) {
        this.setState({selectedCategory: val.value});
        this.retrieveNumDetails(val.value);
    }

    handleChange(e) {

        var val = e.target.value;

        this.setState({
            gender: val
        });
    }

    addRecord() {
        var route = this.refs.route.value;
        var attempts = this.refs.attempts.value;
        var tagNum = this.refs.tagNum.value;
    }

    registerClimber() {
        var selectedCategory = this.state.selectedCategory;
        var participantID = this.refs.participantID.value;
        var detail = this.refs.detail.value;

        console.log(participantID, selectedCategory, detail);

        // climberManagementAPI.registerClimber(participantID, selectedCategory, detail).then(function(response){
        //     console.log("response", response);
        // });
    }

    addClimber() {
        var that = this;
        var first_name = this.refs.firstName.value;
        var last_name = this.refs.lastName.value;
        var gender = this.state.gender;
        var date_of_birth = this.refs.dob.value;
        var id_number = this.refs.nric.value;
        var nationality = this.refs.nationality.value;
        var organization = this.refs.organization.value;

        climberManagementAPI.addClimber(first_name, last_name, gender, date_of_birth, id_number, nationality, organization).then(function(response) {
            console.log("response", response);
            that.setState({
                registerMessage: response.message
            });

            that.refs.firstName.value = '';
            that.refs.lastName.value = '';
            that.state.gender = '';
            that.refs.dob.value = '';
            that.refs.nric.value = '';
            that.refs.nationality.value = '';
            that.refs.organization.value = '';
        });
    }

    startEvent() {
        var that = this;
        var category = this.state.selectedCategory;
        climberManagementAPI.startEvent(category).then(function(response) {
            console.log("response", response);

            that.setState({
                hasEventStarted: true,
                currentEvent: category
            })
        });

        this.setDetail(1);
    }

    setDetail(detail) {
        var that = this;

        climberManagementAPI.setCurrentDetail(detail).then(function(response){
            that.setState({
                currentDetail: detail
            });
        });
    }

    nextDetail() {
        var {currentDetail, numDetails} = this.state;

        if(currentDetail < numDetails) {
            this.setDetail(parseInt(currentDetail) + 1);
        }
    }

    endEvent() {
        var that = this;
        climberManagementAPI.endEvent().then(function(response) {

            that.setState({
                currentEvent: '-',
                hasEventStarted: false
            })
        });

        this.setDetail(0);
    }

    render() {

        var that = this;
        var {
            categories,
            selectedCategory,
            message,
            registerMessage,
            currentDetail,
            currentEvent,
            hasEventStarted
        } = this.state;

        return (
                <div className="large-10 columns large-centered margin-top-md">
                    <div style={{
                        marginBottom: '1.2rem'
                    }}>
                        <div className="page-title">Climber Management</div>
                            <div className="profile wrapper settings-wrapper" style={{
                                'color': '#000'
                            }}>
                            <div className="row collapse">
                              <div className="medium-3 columns">
                                <ul className="tabs vertical" id="example-vert-tabs" data-tabs>
                                  <li className="tabs-title is-active"><a href="#panel1v" aria-selected="true"><FontAwesome name='plus-circle'/> Add Climber</a></li>
                                  <li className="tabs-title"><a href="#panel2v"><FontAwesome name='plus-circle'/> Edit Climber Details</a></li>
                                  <li className="tabs-title"><a href="#panel3v"><FontAwesome name='plus-circle'/> Add Score</a></li>
                                  <li className="tabs-title"><a href="#panel4v"><FontAwesome name='edit'/> Edit Score</a></li>
                                </ul>
                                </div>
                                <div className="medium-9 columns">
                                <div className="tabs-content vertical" data-tabs-content="example-vert-tabs">
                                  <div className="tabs-panel is-active" id="panel1v">
                                    <form>
                                        <label>First Name
                                            <input type="text" name="firstName" ref="firstName" placeholder="First Name" required/>
                                        </label>
                                        <label>Last Name
                                            <input type="text" name="lastName" ref="lastName" placeholder="Last Name" required/>
                                        </label>
                                        <legend>Gender</legend>
                                        <input type="radio" onChange={this.handleChange.bind(this)} name="gender" value="male"/><label htmlFor="male">Male</label>
                                        <input type="radio" onChange={this.handleChange.bind(this)} name="gender" value="female"/><label htmlFor="female">female</label>
                                        <label>Date of Birth
                                            <input type="date" name="dob" ref="dob" required/>
                                        </label>
                                        <label>NRIC
                                            <input type="text" name="nric" ref="nric" placeholder="Nric" required/>
                                        </label>
                                        <label>Nationality
                                            <input type="text" name="nationality" ref="nationality" placeholder="Nationality" required/>
                                        </label>
                                        <label>Organization
                                            <input type="text" name="organization" ref="organization" placeholder="Organization" required/>
                                        </label>
                                        <a className="button proceed expanded" onClick={this.addClimber.bind(this)}>Add Climber</a>
                                        <ResponseMessage message={registerMessage}/>
                                    </form>
                                  </div>
                                  <div className="tabs-panel" id="panel2v">
                                      <form>
                                          <label>Category
                                              <Select name='selectedCategory'
                                                      value={selectedCategory}
                                                      options={categories}
                                                      onChange={this.selectCategory.bind(this)}/>
                                          </label>

                                          <label>Participant ID
                                              <input type="text" ref="participantID" placeholder="001"/>
                                          </label>

                                          <label>Detail
                                              <input type="number" ref="detail" placeholder="1"/>
                                          </label>

                                          <a className="button proceed expanded" onClick={this.registerClimber.bind(this)}>Add Climber</a>
                                      </form>
                                  </div>
                                  <div className="tabs-panel" id="panel3v">
                                    <p>Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.</p>
                                  </div>
                                  <div className="tabs-panel" id="panel4v">
                                    <form>
                                      <label>Tag Number
                                            <input type="text" name="tagNum" ref="tagNum" placeholder="Tag Number" required/>
                                      </label>
                                      <label>Route Number
                                        <select ref="route">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                        </select>
                                      </label>
                                      <label>Attempts
                                          <input type="text" name="attempts" ref="attempts" placeholder="Attempts" required/>
                                          <p>Separate each attempt with a period. E.g. A.A.A.B.B.T</p>
                                      </label>
                                      <button onClick={this.addRecord.bind(this)} className="button proceed expanded">Add Record</button>
                                  </form>
                                  </div>
                                </div>
                              </div>
                            </div>

                        </div>
                    </div>
                    <div style={{
                        marginBottom: '1.2rem'
                    }}>
                        <div className="page-title">Utilities</div>
                        <div className="profile wrapper settings-wrapper">
                            <div className="row dailyReportTimeHeader settings-subheader-container">
                                <div className="row columns">
                                    <a className="button proceed" onClick={this.launchAddClimber}>
                                        <FontAwesome name='download'/> Download CSV
                                    </a>

                                    <p>Current Event: {currentEvent}</p>
                                    <p>Current detail: {currentDetail}</p>

                                    <form>
                                        <label>Category
                                            <Select name='selectedCategory'
                                                    value={selectedCategory}
                                                    options={categories}
                                                    onChange={this.selectCategory.bind(this)}/>
                                        </label>

                                        <div className="margin-top-small">

                                            <a className="button proceed margin-left-tiny" onClick={this.startEvent.bind(this)}>
                                                Start Event
                                            </a>

                                            <a className="button proceed margin-left-tiny" onClick={this.nextDetail.bind(this)}>
                                                Start Next Detail
                                            </a>

                                            <a className="button proceed margin-left-tiny" onClick={this.endEvent.bind(this)}>
                                                End Event
                                            </a>
                                        </div>
                                    </form>


                                </div>
                            </div>
                        </div>
                    </div>

                    <ResponseMessage message={message}/>
                </div>

        );
    }
};

module.exports = Admin;

class ResponseMessage extends React.Component {
    render() {
        return (
            <div className="statusText">{this.props.message}</div>
        );
    }
}
