var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
import Popup from 'react-popup';
var FontAwesome = require('react-fontawesome');
var settingsAPI = require('settingsAPI');
var scoreAPI = require('scoreAPI');
var climberManagementAPI = require('climberManagementAPI');
var Select = require('react-select');
var AddSensor = require('AddSensor');
var user = null;

class Admin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userDisplayName: '-',
            email: '-',
            message: '',
            recommendedID: 0,
            registerMessage: '',
            gender: '',
            categories: [],
            selectedCategory: '',
            selectedCategoryUtil: '',
            currentDetail: 0,
            currentEvent: '-',
            numDetails: 0,
            editMessage: '',
            hasEventStarted: false
        }

        this.selectCategory = this.selectCategory.bind(this);
        this.selectCategoryUtil = this.selectCategoryUtil.bind(this);
    }

    componentDidMount() {

        this.retrieveCurrentEvent();
        this.retrieveCurrentDetail();
        this.retrieveCategories();
        this.retrieveRecommendedID();
    }

    retrieveCurrentEvent() {
        var that = this;
        climberManagementAPI.getCurrentEvent().then(function(response){
            // console.log("Current event", response);
            that.setState({
                currentEvent: response.message
            })

            if(response.message.length > 0) {
                that.retrieveNumDetails(response.message);
            }

        });
    }

    retrieveCurrentDetail() {
        var that = this;
        climberManagementAPI.getCurrentDetail().then(function(response){
            // console.log("Current detail", response);
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

    selectCategoryUtil(val) {
        this.setState({selectedCategoryUtil: val.value});
        this.retrieveNumDetails(val.value);
    }

    handleChange(e) {

        var val = e.target.value;

        this.setState({
            gender: val
        });
    }

    editRecord() {
        var route = this.refs.route.value;
        var attempts = this.refs.attempts.value;
        var tagID = this.refs.tagNum.value;
        var that = this;

        //tagID, route, attempts, judge

        climberManagementAPI.submitScore(tagID, route, attempts, "admin").then(function(response) {
            console.log("response", response);
            that.setState({
                editMessage: response
            });
        });
    }

    addClimber() {
        var that = this;
        var climberID = this.refs.climberID.value;
        var first_name = this.refs.firstName.value;
        var last_name = this.refs.lastName.value;
        var gender = this.state.gender;
        var date_of_birth = this.refs.dob.value;
        var id_number = this.refs.nric.value;
        var nationality = this.refs.nationality.value;
        var organization = this.refs.organization.value;
        var detail = this.refs.detail.value;
        var categoryID = this.state.selectedCategory;
        var errorMessages = [];

        climberManagementAPI.addClimber(climberID, first_name, last_name, gender, date_of_birth, id_number, nationality, organization).then(function(addResponse){
            // console.log(addResponse);
            // console.log("addResponse.hasOwnProperty('error')", addResponse.hasOwnProperty('error'));
            if(addResponse.hasOwnProperty('error')) {
                errorMessages.push(addResponse.error);
            }

            climberManagementAPI.registerClimber(climberID, categoryID, detail).then(function(registerResponse) {

                if(registerResponse.hasOwnProperty('error')) {
                    errorMessages.push(registerResponse.error);
                }

                if(errorMessages.length > 0) {

                    var temp = errorMessages.join();

                    that.setState({
                        registerMessage: temp
                    });

                } else {
                    that.setState({
                        registerMessage: "Participant successfully registered."
                    });

                    that.refs.climberID.value = '';
                    that.refs.firstName.value = '';
                    that.refs.lastName.value = '';
                    that.refs.dob.value = '';
                    that.refs.nric.value = '';
                    that.refs.nationality.value = '';
                    that.refs.organization.value = '';
                    that.refs.detail.value = '';

                    that.retrieveRecommendedID();
                }
            });
        });
    }

    retrieveRecommendedID() {
        var that = this;
        climberManagementAPI.getLastCLimberID().then(function(response){

            var recommendedID = '';

            var responseStr = (response + 1).toString();

            if(responseStr.length == 2) {
                recommendedID = `0${(response + 1).toString()}`;
            } else if(responseStr.length == 1) {
                recommendedID = `00${(response + 1).toString()}`;
            } else {
                recommendedID = response
            }

            that.setState({
                recommendedID: recommendedID
            });
        });
    }

    startEvent() {
        var that = this;
        var {hasEventStarted, selectedCategoryUtil} = this.state;

        if(hasEventStarted) {
            alert("Please end event yo.");
        } else {

            if(selectedCategoryUtil === "") {
                alert("Niggaaaaaa, select an event.");
            } else {
                climberManagementAPI.startEvent(selectedCategoryUtil).then(function(response) {

                    that.setState({
                        hasEventStarted: true,
                        currentEvent: selectedCategoryUtil
                    })

                        that.setDetail(1);
                });
            }
        }
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

    previousDetail() {
        var {currentDetail, numDetails} = this.state;

        if(currentDetail < numDetails) {
            this.setDetail(parseInt(currentDetail) - 1);
        }
    }

    launchStartEventDialog() {
        var {hasEventStarted} = this.state;
        if(!hasEventStarted) {
            if (confirm("Nigga, you wanna start this event?") == true) {
               this.startEvent();
            } else {
               console.log("Start event cancelled");
            }
        } else {
            alert("There's an ongoing event bruh.");
        }
    }

    launchEndEventDialog() {
        var {hasEventStarted} = this.state;
        if(hasEventStarted) {
            if (confirm("Nigga, you wanna end this event?") == true) {
               this.endEvent();
            } else {
               console.log("End event cancelled");
            }
        } else {
            alert("No ongoing event bruh.");
        }
    }

    endEvent() {

        var that = this;
        climberManagementAPI.endEvent().then(function(response) {

            that.setState({
                currentEvent: '-',
                hasEventStarted: false,
                numDetails: 0
            });
        });

        this.setDetail(0);
    }

    launchClearTableDialog() {
        if (confirm("Nigga, you wanna clear all results?") == true) {
           climberManagementAPI.clearResults().then(function(response) {
               alert(response);
           });
        } else {
           console.log("End event cancelled");
        }
    }

    clearTable() {
        var {hasEventStarted} = this.state;

        if(!hasEventStarted) {
            this.launchClearTableDialog();
        } else {
            alert('End current event pl0x');
        }
    }

    launchClearTableByCatDialog() {
        var {selectedCategoryUtil} = this.state;
        if(selectedCategoryUtil.length > 0) {
            if (confirm(`Nigga, you wanna clear results from ${selectedCategoryUtil}?`) == true) {
                climberManagementAPI.clearResultsByCat(selectedCategoryUtil).then(function(response) {
                    alert(response);
                });
            } else {
               console.log("End event cancelled");
            }
        } else {
            alert("Select a category bruh.")
        }
    }

    clearTableByCat() {
        var {hasEventStarted, selectedCategoryUtil} = this.state;

        if(!hasEventStarted) {
            this.launchClearTableByCatDialog();
        } else {
            alert('Please end current event pl0x');
        }
    }

    render() {

        var that = this;
        var {
            categories,
            selectedCategory,
            selectedCategoryUtil,
            message,
            numDetails,
            recommendedID,
            registerMessage,
            currentDetail,
            currentEvent,
            hasEventStarted,
            editMessage
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
                                  <li className="tabs-title"><a href="#panel4v"><FontAwesome name='edit'/> Edit Score</a></li>
                                </ul>
                                </div>
                                <div className="medium-9 columns">
                                <div className="tabs-content vertical" data-tabs-content="example-vert-tabs">
                                  <div className="tabs-panel is-active" id="panel1v">
                                    <form>
                                        <p>Recommended ID: {recommendedID}</p>
                                        <label>Climber ID
                                            <input type="text" name="climberID" ref="climberID" placeholder="Climber ID" required/>
                                        </label>
                                        <label>First Name
                                            <input type="text" name="firstName" ref="firstName" placeholder="First Name" required/>
                                        </label>
                                        <label>Last Name
                                            <input type="text" name="lastName" ref="lastName" placeholder="Last Name" required/>
                                        </label>
                                        <legend>Gender</legend>
                                        <input type="radio" onChange={this.handleChange.bind(this)} name="gender" defaultChecked value="male"/><label htmlFor="male">Male</label>
                                        <input type="radio" onChange={this.handleChange.bind(this)} name="gender" value="female"/><label htmlFor="female">female</label>
                                        <label>Date of Birth
                                            <input type="date" name="dob" ref="dob" required/>
                                        </label>
                                        <label>NRIC
                                            <input type="text" name="nric" ref="nric" placeholder="NRIC" required/>
                                        </label>
                                        <label>Nationality
                                            <input type="text" name="nationality" ref="nationality" placeholder="Nationality" required/>
                                        </label>
                                        <label>Organization
                                            <input type="text" name="organization" ref="organization" placeholder="Organization" required/>
                                        </label>

                                        <label>Category
                                            <Select name='selectedCategory'
                                                    value={selectedCategory}
                                                    options={categories}
                                                    placeholder={"Category"}
                                                    onChange={this.selectCategory.bind(this)}/>
                                        </label>

                                        <label>Detail
                                            <input type="number" ref="detail" placeholder="1"/>
                                        </label>

                                        <a className="button proceed expanded" onClick={this.addClimber.bind(this)}>Add Climber</a>
                                        <ResponseMessage message={registerMessage}/>
                                    </form>
                                  </div>

                                  <div className="tabs-panel" id="panel4v">
                                    <form>
                                      <label>Tag Number
                                            <input type="text" name="tagNum" ref="tagNum" placeholder="OMQ001" required/>
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
                                          <input type="text" name="attempts" ref="attempts" placeholder="ABBBT" required/>
                                      </label>
                                      <button onClick={this.editRecord.bind(this)} className="button proceed expanded">Edit Record</button>
                                    <ResponseMessage message={editMessage}/>

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
                        <div className="page-title">Event Management</div>
                        <div className="profile wrapper settings-wrapper">
                            <div className="row dailyReportTimeHeader settings-subheader-container">
                                <div className="row columns">

                                    <p><b>Current Event</b>: {currentEvent}</p>
                                    <p><b>Current detail</b>: {currentDetail === 0 ? "-" : currentDetail}/{numDetails === 0 ? "-" : numDetails}</p>

                                    <form>
                                        <div className="row">
                                        <div className="columns large-6">
                                            <label>Category
                                                <Select name='selectedCategory'
                                                        value={selectedCategoryUtil}
                                                        options={categories}
                                                        placeholder={"Category"}
                                                        onChange={this.selectCategoryUtil.bind(this)}/>
                                            </label>
                                        </div>
                                        </div>

                                        <div className="margin-top-small">

                                            <a className="button proceed margin-left-tiny" onClick={this.launchStartEventDialog.bind(this)}>
                                                Start Event
                                            </a>

                                            <a className="button proceed margin-left-tiny" onClick={this.nextDetail.bind(this)}>
                                                Start Next Detail
                                            </a>

                                            <a className="button proceed margin-left-tiny" onClick={this.previousDetail.bind(this)}>
                                                Previous Detail
                                            </a>

                                            <a className="button cancel margin-left-tiny" onClick={this.launchEndEventDialog.bind(this)}>
                                                End Event
                                            </a>

                                            <a className="button cancel margin-left-tiny" onClick={this.clearTable.bind(this)}>
                                                Clear Results
                                            </a>

                                            <a className="button cancel margin-left-tiny" onClick={this.clearTableByCat.bind(this)}>
                                                Clear Results by Category
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div style={{
                        marginBottom: '1.2rem'
                    }}>
                        <div className="page-title">Utilities</div>
                        <div className="profile wrapper settings-wrapper">
                            <div className="row columns">
                                <a className="button proceed" onClick={this.launchAddClimber} href="http://office.livestudios.com:41111/backend/completed-events/">
                                    <FontAwesome name='download'/> Download CSV
                                </a>
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
