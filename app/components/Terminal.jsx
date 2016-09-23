var React = require('react');
const iframeLink = "http://opsdev.sence.io:4201/";
var FontAwesome = require('react-fontawesome');

class Terminal extends React.Component {
    constructor(props) {
      super(props)
    }

    refresh() {
      $('#terminalIFrame').attr( 'src', function ( i, val ) { return val; });
    }

    close() {
      $('#terminal').foundation('close');
    }

    render() {
      return(
          <div id="terminal" className="reveal large" data-reveal="" style={{padding: '0', border: 'none', background: '#000'}}>
            <div className="top-bar">
              <div className="top-bar-title">terminal</div>
              <div className="top-bar-right">
                  <a className="margin-right-tiny" onClick={this.refresh}><FontAwesome name='refresh'/></a>
                  <a onClick={this.close}><FontAwesome name='close'/></a>
              </div>
            </div>
            <iframe id="terminalIFrame" src={iframeLink} width="100%" style={{
                border: "none"
            }} height="500px"></iframe>
          </div>
      );
    }
}

module.exports = Terminal;
