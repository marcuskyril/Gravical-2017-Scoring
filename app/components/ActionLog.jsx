var React = require('react');
import * as Redux from 'react-redux';
import * as actions from 'actions';
var {connect} = require('react-redux');
var Griddle = require('griddle-react');

const tableMetaData = [
    {
        "columnName": "userId",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "User ID"
    }, {
        "columnName": "action",
        "order": 2,
        "locked": false,
        "visible": false,
        "displayName": "Action"
    }, {
        "columnName": "timestamp",
        "order": 3,
        "locked": true,
        "visible": true,
        "displayName": "Timestamp"
    }
];

class ActionLog extends React.Component{

    constructor(props) {
        super(props);
        console.log("ActionLog props", props);

        this.state = {
            logs: []
        }
    }

    componentDidMount() {
        // retrieve shit here
        var {dispatch} = this.props;
        dispatch(actions.startRetrieveLogs());

    }

    componentWillReceiveProps(props) {

        this.setState({
            logs: props.logs
        });
    }

    render() {

        var {logs} = this.state;
        var data = [];

        for (var id in logs) {

            // console.log("userId", logs[id]['userId']);

            var row = {
                userId: logs[id]['userId'],
                action: logs[id]['action'],
                timestamp: logs[id]['timestamp']
            };

            data.push(row);
        }

        return (
            <div className="row columns">
                <div className="actionLogWrapper" style={{paddingTop: '2rem', paddingBottom: '2rem'}}>
                    <div className="callout callout-dark-header">
                        <div className="header">Action Log</div>
                    </div>
                    <div className="callout-dark">
                        <Griddle results={data}
                                  showFilter={true}
                                  resultsPerPage={25}
                                  initialSort="timestamp"
                                  tableClassName="actionLog"
                                  columns={["userId", "action", "timestamp"]}
                                  columnMetadata={tableMetaData}/>
                    </div>
                </div>
            </div>
        );
    }

};

function mapStateToProps(state, ownProps) {

    // console.log("state", state);

    return {
        sensorData: state.activeSensor,
        userId: state.syncData.userId,
        logs: state.auditLog.logs
    }
}

module.exports = connect(mapStateToProps)(ActionLog);
