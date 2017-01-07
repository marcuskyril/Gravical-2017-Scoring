var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import firebase, {firebaseRef} from 'app/firebase/';
var FontAwesome = require('react-fontawesome');
var settingsAPI = require('settingsAPI');
var scoreAPI = require('scoreAPI');
var Select = require('react-select');
var user = null;

class Score extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            details: [],
            climbers: [],
            routes: [{value:"1", label: "1"},{value:"2", label: "2"}, {value:"3", label: "3"},{value:"4", label: "4"},{value:"5", label: "5"},{value:"6", label: "6"}],
            selectedCategory: '',
            selectedDetail: '',
            selectedClimber: '',
            selectedRoute: '',
            userDisplayName: '-',
            email: '-',
            message: '',
            numAttempt: 0,
            numBonus: 0,
            numTop: 0,
            currentScore: '',
            judgeName: ''
        }

        this.selectCategory = this.selectCategory.bind(this);
        this.selectDetail = this.selectDetail.bind(this);
        this.selectClimber = this.selectClimber.bind(this);
        this.selectRoute = this.selectRoute.bind(this);
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

        this.retrieveCategories();
    }

    selectCategory(val) {
        document.activeElement.blur();
        this.setState({selectedCategory: val.value});
        this.retrieveDetails(val.value);
    }

    retrieveDetails(category) {

        var that = this;
        scoreAPI.retrieveDetails(category).then(function(response){

            var temp = [];

            for(var i = 0; i < response['num_of_details']; i++) {
                temp.push({value: i+1, label: i+1});
            }

            that.setState({
                details: temp
            })
        });
    }

    selectDetail(val) {
        document.activeElement.blur();
        this.setState({selectedDetail: val.value});
        this.retrieveClimbers(this.state.selectedCategory, val.value);
    }

    retrieveClimbers(categoryID, detail) {

        var that = this;

        scoreAPI.retrieveClimbers(categoryID, detail).then(function(response){
            console.log("response", response);

            var temp = [];

            response.forEach(function(climber) {
                temp.push({value: climber, label: climber})
            });

            that.setState({
                climbers: temp
            })
        });
    }

    selectClimber(val) {
        document.activeElement.blur();
        this.setState({selectedClimber: val.value});
    }

    selectRoute(val) {
        document.activeElement.blur();
        var that = this;
        var selectedCategory = this.state.selectedCategory;
        var selectedClimber = this.state.selectedClimber;
        scoreAPI.retrieveScore(`${selectedCategory}${selectedClimber}`, val.value).then(function(score) {
            console.log("response", score);
            that.setState({
                currentScore: score['current_score']
            })
        });

        this.setState({selectedRoute: val.value});
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

    addAttempt() {

        var {currentScore} = this.state;

        this.setState({
            currentScore: `${currentScore}A`
        })
    }

    addBonus() {
        var {currentScore} = this.state;

        this.setState({
            currentScore: `${currentScore}B`
        })
    }

    addTop() {
        var {currentScore} = this.state;

        this.setState({
            currentScore: `${currentScore}T`
        })
    }

    backspace() {
        var {currentScore} = this.state;

        this.setState({
            currentScore: currentScore.slice(0, -1)
        })
    }

    submitScore() {
        var that = this;
        var judge = this.refs.routeJudgeName.value;
        var selectedCategory = this.state.selectedCategory;
        var tagID = this.state.selectedClimber;
        var route = this.state.selectedRoute;
        var score = this.refs.score.value;

        scoreAPI.submitScore(`${selectedCategory}${tagID}`, parseInt(route), score, judge).then(function(response) {
            console.log(response);
            that.setState({
                message: "Score submitted"
            });
        });
    }

    render() {

        var that = this;
        var {
            message,
            currentScore,
            categories,
            details,
            climbers,
            routes,
            selectedCategory,
            selectedDetail,
            selectedClimber,
            selectedRoute
        } = this.state;

        return (
                <div className="large-10 columns large-centered margin-top-md">
                    <div style={{
                        marginBottom: '1.2rem'
                    }}>
                        <div className="page-title">Scoring</div>
                            <div className="profile wrapper settings-wrapper" style={{
                                'color': '#000'
                            }}>
                                <form>
                                    <label>Judge Name
                                        <input type="text" ref="routeJudgeName" placeholder="Route Judge Name"/>
                                    </label>

                                    <label>Category
                                        <Select name='selectedCategory'
                                                value={selectedCategory}
                                                options={categories}
                                                autoBlur={true}
                                                onChange={this.selectCategory.bind(this)}/>
                                    </label>
                                    <label>Detail
                                        <Select name='selectedDetail'
                                                value={selectedDetail}
                                                options={details}
                                                autoBlur={true}
                                                onChange={this.selectDetail.bind(this)}/>
                                    </label>
                                    <label>Climber
                                        <Select name='selectedClimber'
                                                value={selectedClimber}
                                                options={climbers}
                                                autoBlur={true}
                                                onChange={this.selectClimber.bind(this)}/>
                                    </label>
                                    <label>Route
                                        <Select name='selectedRoute'
                                                value={selectedRoute}
                                                options={routes}
                                                autoBlur={true}
                                                onChange={this.selectRoute.bind(this)}/>
                                    </label>

                                    <label>Score
                                        <input type="text" ref="score" value={currentScore} disabled/>
                                    </label>

                                    <div className="row">
                                        <div className="column small-6 large-6">
                                            <a className="button btn-score" onClick={this.addAttempt.bind(this)}>A</a>
                                        </div>
                                        <div className="column small-6 large-6">
                                            <a className="button btn-score" onClick={this.addTop.bind(this)}>T</a>
                                        </div>
                                        <div className="column small-6 large-6">
                                            <a className="button btn-score" onClick={this.addBonus.bind(this)}>B</a>
                                        </div>
                                        <div className="column small-6 large-6">
                                            <a className="button btn-score cancel" onClick={this.backspace.bind(this)}>Backspace</a>
                                        </div>

                                    </div>
                                    <div style={{padding: "0px 10px"}}>
                                        <a className="button proceed expanded btn-submit" onClick={this.submitScore.bind(this)}>Submit</a>
                                    </div>
                                </form>
                            </div>
                    </div>

                    <ResponseMessage message={message}/>
                </div>

        );
    }
};

module.exports = Score;

class ResponseMessage extends React.Component {
    render() {
        return (
            <div className="statusText">{this.props.message}</div>
        );
    }
}
