var React = require('react');
var Griddle = require('griddle-react');
var axios = require('axios');
var FontAwesome = require('react-fontawesome');

class WatchComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    arrNoDupe(a) {
        var temp = {};
        for (var i = 0; i < a.length; i++) {
            temp[a[i]] = true;
            var r = [];
            for (var k in temp) {
                r.push(k);
            }
        }

        return r.join();
    }

    handleClick(data) {

        var originalShizz = document.cookie;
        var temp = '';

        if(originalShizz.length > 0){
            var pinned = `${originalShizz},${data.ID}`;
            temp = this.arrNoDupe(pinned.split(','));
        } else {
            temp = data.ID
        }

        document.cookie = temp;
    }

    render() {
        // console.log("this.props.data" ,this.props);
        return (
            <div id="unpin-btn" className="sensorBlock remove" onClick={() => this.handleClick(this.props.rowData)}>Pin</div>
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
    }, {
        "columnName": "actions",
        "order": 6,
        "locked": false,
        "visible": true,
        "sortable": true,
        "displayName": "Actions",
        "customComponent": WatchComponent
    }
];

const columnDisplayName = {
    "Rank": "rank",
    "ID": "ID",
    "Name": "name",
    "Detail": "detail",
    "Actions": "actions",
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
        // to do
        // check for last result;

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
                    "score": rawResults[i]["score"],
                    "actions": rawResults[i]["ID"]
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
            "detail",
            "actions"
        ];
        var findStuff = $('#bfg').find('table > thead > tr > th > span');
        // console.log(findStuff);
        if (findStuff.length > 0) {
            currentlySelected = [];
            for (var i = 0; i < findStuff.length; i++) {
                currentlySelected.push(columnDisplayName[findStuff[i].innerHTML]);
            }
        }

        return (
            <Griddle results={results} columnMetadata={tableMetaData} tableClassName="table" showFilter={true} columns={currentlySelected} resultsPerPage={10} showSettings={false} />
        );
    }
}

module.exports = Tableaux;
