var React = require('react');
var Griddle = require('griddle-react');
var ReactDOM = require('react-dom');
import * as Redux from 'react-redux';
import * as actions from 'actions';
import {connect} from 'react-redux';

var dataList = [];

class RemoveComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    handleClick(data) {
        var cookieData = document.cookie;
        var cookieDataArr = cookieData.split(',');
        var index = cookieDataArr.indexOf(data);
        var temp = cookieDataArr.splice(index, 1);

        document.cookie = cookieDataArr.join();
    }

    render() {
      return (
        <div id="unpin-btn" className="sensorBlock remove" onClick={() => this.handleClick(this.props.data)}>Un-Pin</div>
      );

    }
};

const tableMetaData = [
    {
        "columnName": "ID",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "ID"
    }, {
        "columnName": "name",
        "order": 2,
        "locked": true,
        "visible": true,
        "displayName": "Name"
    }, {
        "columnName": "score",
        "order": 3,
        "locked": true,
        "visible": true,
        "displayName": "Score"
    }, {
        "columnName": "category",
        "order": 4,
        "locked": true,
        "visible": true,
        "displayName": "Category"
    }, {
        "columnName": "ranking",
        "order": 5,
        "locked": true,
        "visible": true,
        "displayName": "Ranking"
    },{
        "columnName": "remove",
        "order": 6,
        "locked": true,
        "visible": true,
        "sortable": false,
        "displayName": "Remove",
        "customComponent": RemoveComponent
    }

];

const rowMetaData = {
  "bodyCssClassName": "customTableRow"
}

class WatchList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pinned: [],
            watchlist: []
        }
    }

    componentWillReceiveProps(props) {
        var {pinned} = this.state;
        var results = props.data;
        var that = this;
        var r = [];

        console.log("document.cookie", document.cookie);

        var pinnedStr = document.cookie;

        if(pinnedStr.length > 0) {
            that.setState({
                pinned: pinnedStr.split(',')
            });
        } else {
            that.setState({
                pinned: [],
                watchlist: []
            });
        }

        if(pinned.length > 0 && results.length > 0) {

            results.forEach(function(climber){
                var climberID = climber.ID;

                pinned.forEach(function(pinnedClimber){
                    if(climberID === pinnedClimber) {
                        var row = {
                            ID: climber.ID,
                            detail: climber.detail,
                            name: climber.name,
                            score: climber.score,
                            category: climber.category,
                            ranking: climber.rank,
                            remove: climber.ID
                        }
                        r.push(row);
                    }
                })

            });

            this.setState({
                watchlist: r
            });
        }
    }

    render() {
        var {watchlist} = this.state;

        return (
            <div>
                <Griddle results={watchlist}
                          showFilter={true}
                          initialSort="building_name"
                          tableClassName="piOverviewTable"
                          columns={["ID", "name", "score", "category", "ranking", "remove"]}
                          columnMetadata={tableMetaData}
                          rowMetaData={rowMetaData}/>
            </div>
        );
    }
}

module.exports = connect()(WatchList);
