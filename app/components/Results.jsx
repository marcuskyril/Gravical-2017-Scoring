var React = require('react');
var Griddle = require('griddle-react');
var axios = require('axios');
var FontAwesome = require('react-fontawesome');

class WatchComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(macAddress) {

        alert("HOOYAH, MOTHERFUCKERS");
    }

    render() {
        return (
            <div id="unpin-btn" className="sensorBlock remove" onClick={() => this.handleClick(this.props.data.ID)}>Pin</div>
        );

    }
};

const tableMetaData = [
    {
        "columnName": "rank",
        "order": 1,
        "locked": true,
        "visible": true,
        "displayName": "Rank",
        "sortable": true
    }, {
        "columnName": "ID",
        "order": 2,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "ID"
    }, {
        "columnName": "name",
        "order": 3,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Name"
    }, {
    }, {
        "columnName": "detail",
        "order": 4,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Detail"
    }, {
        "columnName": "score",
        "order": 5,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Score"
    }
];

const columnDisplayName = {
    "Rank": "rank",
    "ID": "ID",
    "Name": "name",
    "Detail": "detail",
    "Score": "score"
};

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataList: [],
            results: []
        };
    }

    componentWillReceiveProps() {

        var results = [];
        var rawResults = this.props.data;
        var rank = 0;

        var prev_score = "0";

        if(rawResults) {
            // console.log(rawResults);
            for(var i = 0; i < rawResults.length; i++) {
                if (rawResults[i]["score"] != prev_score) {
                    rank++;
                }
                var row = {
                    "rank" : rank,
                    "ID": rawResults[i]["ID"],
                    "name": rawResults[i]["name"],
                    "detail": rawResults[i]["detail"],
                    "score": rawResults[i]["score"]
                }
                prev_score = rawResults[i]["score"];

                results.push(row);
            }
        }
        this.setState({results: results});

    }
    render() {

        var {results} = this.state;

        var currentlySelected = [
            "rank",
            "ID",
            "name",
            "detail",
            "score",
        ];

        return (
            <Griddle results={results} columnMetadata={tableMetaData} tableClassName="table" showFilter={true} columns={currentlySelected} showSettings={false} />
        );
    }
}

module.exports = Results;
