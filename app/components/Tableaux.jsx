var React = require('react');
var Griddle = require('griddle-react');
var axios = require('axios');
var FontAwesome = require('react-fontawesome');

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
        "columnName": "score",
        "order": 4,
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
    "Score": "score"
};

class Tableaux extends React.Component {
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
            for(var i = 0; i < rawResults.length; i++) {
                if (rawResults[i]["score"] != prev_score) {
                    rank++;
                }
                var row = {
                    "rank" : rank,
                    "ID": rawResults[i]["ID"],
                    "name": rawResults[i]["name"],
                    "score": rawResults[i]["score"]
                }
                prev_score = rawResults[i]["score"];

                results.push(row);
            }
        }

        this.setState({results: results});
    }
    render() {

        var that = this;
        var {results} = this.state;

        var currentlySelected = [
            "rank",
            "ID",
            "name",
            "score",
        ];

        var findStuff = $('#bfg').find('table > thead > tr > th > span');
        if (findStuff.length > 0) {
            currentlySelected = [];
            for (var i = 0; i < findStuff.length; i++) {
                currentlySelected.push(columnDisplayName[findStuff[i].innerHTML]);
            }
        }

        return (
            <Griddle results={results} columnMetadata={tableMetaData} tableClassName="table" showFilter={true} columns={currentlySelected} resultsPerPage={20} showSettings={false} />
        );
    }
}

module.exports = Tableaux;
