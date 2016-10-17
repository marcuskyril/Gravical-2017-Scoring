var React = require('react');
var axios = require('axios');
var FontAwesome = require('react-fontawesome');

class SensorDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mac_address: '',
            building_name: '',
            building_level: '',
            area_id: '',
            CPU_usage: '',
            days: '',
            flapping: '',
            hours: '',
            last_reboot: '',
            mins: '',
            ram: '',
            status: '',
            storage: '',
            temperature: '',
            uptime_percentage: '',
            process1name: '',
            process1value: '',
            process2name: '',
            process2value: '',
            process3name: '',
            process3value: '',
            process4name: '',
            process4value: '',
            process5name: '',
            process5value: ''
        };
    }

    componentDidMount() {

        var socket;

        const SOCKET_URL = "ws://opsdev.sence.io:9010/SensorStatus";

        try {
            socket = new WebSocket(SOCKET_URL);
            // log('WebSocket - status ' + socket.readyState);
            socket.onopen = function(msg) {
                console.log("connected");

                // TO DO:
                // Retrieve mac address from redux
                send(macAddress);
                // console.log("1st send");
            };
            socket.onmessage = function(msg) {

                var response = JSON.parse(msg.data);

                console.log("response", response);

                setTimeout(function() {
                    send(macAddress);
                }, 5000);

            };
            socket.onclose = function(msg) {
                console.log("Disconnected");
            };

        } catch (ex) {
            console.warn(ex);
        }

    }

    render() {
        return (
            <div>
                Guess who's back?
            </div>
        );
    }
};

module.exports = SensorDetails;
