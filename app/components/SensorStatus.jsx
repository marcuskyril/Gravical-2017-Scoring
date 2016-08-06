var React = require('react');

var SensorStatus = React.createClass({
    render: function() {
        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>A</th>
                            <th>B</th>
                            <th>C</th>
                            <th>D</th>
                            <th>E</th>
                            <th>F</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Basement</td>
                            <td>
                              <div className="sensor-block"></div>
                            </td>
                            <td>
                              <div className="sensor-block"></div>
                            </td>
                            <td>
                              <div className="sensor-block"></div>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>L1</td>
                            <td>
                              <div className="sensor-block"></div>
                            </td>
                            <td>
                              <div className="sensor-block"></div>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

module.exports = SensorStatus;
