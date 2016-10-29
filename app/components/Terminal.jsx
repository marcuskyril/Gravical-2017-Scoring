var React = require('react');
const IFRAMEURL = "http://119.81.104.46:4201";
const IFRAMEURL_MAC = "http://119.81.104.46:4201/?username=pi&port=";
var FontAwesome = require('react-fontawesome');

class Terminal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            macAdd: '',
            port: ''
        }

    }

    componentWillReceiveProps(props) {
        var that = this;

        if (props.port) {
            console.log("port", props.port);
            that.setState({macAdd: props.macAdd, port: props.port});
        }
    }

    refresh() {
        $('#terminalIFrame').attr('src', function(i, val) {
            return val;
        });
    }

    close() {
        $('#terminal').foundation('close');
    }

    render() {

        var {macAdd, port} = this.state;
        var IFRAME_URL = '';

        function renderIFrame(port) {

            if(port.length > 0) {
                IFRAME_URL =`${IFRAMEURL_MAC}/${port}`;
            } else {
                IFRAME_URL = IFRAMEURL;
            }

            return (
                <iframe id="terminalIFrame" src={IFRAME_URL} width="100%" style={{
                    border: "none"
                }} height="500px"></iframe>
            );
        }

        return (
            <div id="terminal" className="reveal large" data-reveal="" style={{
                padding: '0',
                border: 'none',
                background: '#000'
            }}>
                <div className="top-bar">
                    <div style={{color: "#fff"}}className="top-bar-left">{macAdd}</div>
                    <div className="top-bar-right">
                        <a className="margin-right-tiny" onClick={this.refresh}><FontAwesome name='refresh'/></a>
                        <a onClick={this.close}><FontAwesome name='close'/></a>
                    </div>
                </div>
                {renderIFrame(port)}
            </div>
        );
    }
}

module.exports = Terminal;
