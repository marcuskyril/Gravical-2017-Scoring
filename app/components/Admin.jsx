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
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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
            gender: 'male',
            categories: [],
            selectedCategory: '',
            selectedCategoryUtil: '',
            currentDetail: 0,
            currentEvent: '-',
            selectedFemaleClimber: '',
            selectedMaleClimber: '',
            currentFemaleClimber: '-',
            currentMaleClimber: '-',
            numDetails: 0,
            editMessage: '',
            hasEventStarted: false,
            maleClimbers: [],
            femaleClimbers: []
        }

        this.selectCategory = this.selectCategory.bind(this);
        this.selectCategoryUtil = this.selectCategoryUtil.bind(this);
    }

    componentDidMount() {
        this.retrieveCurrentEvent();
        this.retrieveCurrentClimbers();
        this.retrieveCurrentDetail();
        this.retrieveCategories();
        this.retrieveRecommendedID();
    }

    retrieveClimbers() {
        var that = this;
        var {currentEvent} = this.state;

        // console.log("currentEvent", currentEvent);

        var femaleEvent = "";

        if(currentEvent === "UF") {
            femaleEvent = "UFF";
        } else {
            femaleEvent = `${currentEvent.charAt(0)}WF`
        }

        climberManagementAPI.retrieveClimbers(femaleEvent).then(function(response) {
            // console.log("female event", femaleEvent);
            var fTemp = [];
            response.forEach(function(climber) {
                fTemp.push({value: climber, label: climber});
            });

            that.setState({
                femaleClimbers: fTemp
            });
        });

        climberManagementAPI.retrieveClimbers(`${currentEvent.charAt(0)}MF`).then(function(response) {
            // console.log(` soooo, ${currentEvent.charAt(0)}MF`);
            var mTemp = [];
            response.forEach(function(climber) {
                mTemp.push({value: climber, label: climber});
            });

            that.setState({
                maleClimbers: mTemp
            });
        });
    }

    retrieveCurrentEvent() {
        var that = this;
        climberManagementAPI.getCurrentFinalEvent().then(function(response){
            // console.log("Current event", response);
            that.setState({
                currentEvent: response.message
            });

            that.retrieveClimbers();

            if(response.message.length > 0) {
                that.retrieveNumDetails(response.message);
            }

        });
    }

    retrieveCurrentClimbers() {
        var that = this;
        climberManagementAPI.getCurrentClimbers().then(function(response) {
            // console.log("currentClimbers", response);
            that.setState({
                currentMaleClimber: response['male'],
                currentFemaleClimber: response['female']
            });
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
            // console.log("response", response);
            that.setState({
                numDetails: response['num_of_details']
            })
        });
    }

    selectCategory(val) {
        this.setState({selectedCategory: val.value});
        this.retrieveNumDetails(val.value);
    }

    selectMale(val) {
        this.setState({selectedMaleClimber: val.value});
    }
    selectFemale(val) {
        this.setState({selectedFemaleClimber: val.value});
    }

    selectCategoryUtil(event) {
        var selectedCategoryUtil = event.target.value;
        console.log("selectedCategoryUtil", selectedCategoryUtil);
        this.setState({selectedCategoryUtil: selectedCategoryUtil});
    }

    handleChange(e) {
        var val = e.target.value;
        this.setState({gender: val});
    }

    editRecord() {
        var route = this.refs.route.value;
        var attempts = this.refs.attempts.value;
        var tagID = this.refs.tagNum.value;
        var that = this;

        //tagID, route, attempts, judge

        scoreAPI.submitScore(tagID, route, attempts, "admin").then(function(response) {
            console.log("response", response);
            that.setState({
                editMessage: response.message
            });

            that.refs.route.value = '';
            that.refs.attempts.value = '';
            that.refs.tagNum.value = '';
        });
    }

    editCategory() {
        var climberID = this.refs.climberID.value;
        var categoryID = this.state.selectedCategory;
        var detail = this.refs.detail.value;
        var errorMsg = '';
        var that = this;

        climberManagementAPI.registerClimber(climberID, categoryID, detail).then(function(registerResponse) {

            if(registerResponse.hasOwnProperty('error')) {
                that.setState({
                    registerMessage: errorMsg
                });
            } else {
                that.setState({
                    registerMessage: "Participant successfully registered."
                });

                that.refs.climberID.value = '';
                that.refs.detail.value = '';
                that.setState({
                    selectedCategory: ''
                });
            }
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
            console.log(climberID, first_name, last_name, gender, date_of_birth, id_number, nationality, organization);
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
                climberManagementAPI.startFinalEvent(selectedCategoryUtil).then(function(response) {
                    // that.retrieveNumDetails(selectedCategoryUtil);
                    that.setState({
                        hasEventStarted: true,
                        currentEvent: selectedCategoryUtil,
                        currentMaleClimber: "-",
                        currentFemaleClimber: "-"
                    });

                    that.retrieveClimbers();

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
        var {hasEventStarted, currentEvent} = this.state;
        console.log("hasEventStarted", currentEvent);
        if(currentEvent.length > 1) {
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
        climberManagementAPI.endFinalEvent().then(function(response) {

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

    resetClimber(gender) {
        var that = this;
        switch(gender) {
            case 'm':
                climberManagementAPI.setMaleClimber("-").then(function(response) {
                    that.setState({
                        currentMaleClimber: "-",
                        selectedMaleClimber: ""
                    })
                });
                break;
            case 'f':
                climberManagementAPI.setFemaleClimber("-").then(function(response) {
                    that.setState({
                        currentFemaleClimber: "-",
                        selectedFemaleClimber: ""
                    })
                });
                break;
            default:
                console.log("nothing here");
                break;
        }
    }

    setClimber(gender) {
        var that = this;
        switch(gender) {
            case 'm':
                var {selectedMaleClimber} = this.state;
                climberManagementAPI.setMaleClimber(selectedMaleClimber).then(function(response) {
                    console.log(response);
                    that.setState({
                        currentMaleClimber: selectedMaleClimber
                    });
                });
                break;
            case 'f':
                var {selectedFemaleClimber} = this.state;
                climberManagementAPI.setFemaleClimber(selectedFemaleClimber).then(function(response) {
                    console.log(response);
                    that.setState({
                        currentFemaleClimber: selectedFemaleClimber
                    });
                });
                break;
            default:
                console.log("nothing here");
                break;
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
            editMessage,
            currentFemaleClimber,
            currentMaleClimber,
            selectedFemaleClimber,
            selectedMaleClimber,
            maleClimbers,
            femaleClimbers
        } = this.state;

        return (
                <div className="large-10 columns large-centered margin-top-md">
                    <div style={{marginBottom: '1.2rem'}}>
                        <div className="callout callout-dark-header">
                            <div className="page-title">Event Management</div>
                        </div>
                        <div className="callout callout-dark">
                            <div className="row dailyReportTimeHeader settings-subheader-container">
                                <div className="row columns">

                                    <p><b>Current Event</b>: {currentEvent}</p>
                                    <p><b>Current Male Climber</b>: {currentMaleClimber}</p>
                                    <p><b>Current Female Climber</b>: {currentFemaleClimber}</p>

                                    <form>
                                        <div className="row">
                                            <div className="columns large-6">
                                                <label>Event
                                                    <select ref="selectedCategoryUtil" onChange={this.selectCategoryUtil.bind(this)}>
                                                        <option value="">Event</option>
                                                        <option value="UF">U17 Finals</option>
                                                        <option value="NF">Novice Finals</option>
                                                        <option value="IF">Intermediate Finals</option>
                                                        <option value="OF">Open Finals</option>
                                                    </select>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="margin-top-small">

                                            <a className="button proceed margin-left-tiny" onClick={this.launchStartEventDialog.bind(this)}>
                                                Start Event
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

                                    <form>
                                        <div className="row">
                                            <div className="columns large-6">
                                                <label>Current Male Climber
                                                    <Select name='selectedCategory'
                                                            value={selectedMaleClimber}
                                                            options={maleClimbers}
                                                            placeholder={"Current Male Climber"}
                                                            onChange={this.selectMale.bind(this)}/>
                                                </label>
                                            </div>

                                            <div className="margin-top-small">
                                                <a className="button proceed margin-left-tiny" onClick={() => this.setClimber('m')}>
                                                    Set Climber
                                                </a>
                                                <a className="button cancel margin-left-tiny" onClick={() => this.resetClimber('m')}>
                                                    Reset
                                                </a>
                                            </div>
                                        </div>
                                    </form>
                                    <form>
                                        <div className="row">
                                            <div className="columns large-6">
                                                <label>Current Female Climber
                                                    <Select name='selectedCategory'
                                                            value={selectedFemaleClimber}
                                                            options={femaleClimbers}
                                                            placeholder={"Current Female Climber"}
                                                            onChange={this.selectFemale.bind(this)}/>
                                                </label>
                                            </div>
                                            <div className="margin-top-small">
                                                <a className="button proceed margin-left-tiny" onClick={() => this.setClimber('f')}>
                                                    Set Climber
                                                </a>
                                                <a className="button cancel margin-left-tiny" onClick={() => this.resetClimber('f')}>
                                                    Reset
                                                </a>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{marginBottom: '1.2rem'}}>
                        <div className="callout callout-dark-header">
                            <div className="page-title">Utilities</div>
                        </div>
                        <div className="callout callout-dark">
                            <div className="row columns">
                                <a className="button proceed" onClick={this.launchAddClimber} href="http://office.livestudios.com:41111/backend/completed-events/">
                                    <FontAwesome name='download'/> Download CSV
                                </a>
                            </div>
                        </div>
                    </div>
                    <div style={{marginBottom: '1.2rem'}}>
                        <div className="callout callout-dark-header">
                            <div className="page-title">Climber Management</div>
                        </div>
                        <div className="callout callout-dark">

                                <Tabs>
                                  <TabList>
                                    <Tab><FontAwesome name='plus-circle'/> Add Climber</Tab>
                                    <Tab><FontAwesome name='edit'/> Edit Score</Tab>
                                    <Tab><FontAwesome name='edit'/> Edit Category</Tab>
                                  </TabList>
                                  <TabPanel>
                                          <form>
                                            <label>Climber ID ({recommendedID})
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
                                  </TabPanel>
                                  <TabPanel>
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
                                       <a onClick={this.editRecord.bind(this)} className="button proceed expanded">Edit Record</a>
                                     <ResponseMessage message={editMessage}/>

                                   </form>
                                  </TabPanel>
                                  <TabPanel>
                                      <form>
                                        <p>Use this form to facilitate transition from qualifiers/semi-finals to finals</p>
                                        <label>Climber ID
                                            <input type="text" name="climberID" ref="climberID" placeholder="Climber ID" required/>
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

                                        <a className="button proceed expanded" onClick={this.editCategory.bind(this)}>Add Climber</a>
                                        <ResponseMessage message={registerMessage}/>
                                    </form>
                                  </TabPanel>
                              </Tabs>
                        </div>
                    </div>
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
