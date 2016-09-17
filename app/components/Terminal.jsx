var React = require('react');
const iframeLink = "http://opsdev.sence.io:4201/";

class Terminal extends React.Component {
    constructor(props) {
      super(props)
    }

    refresh() {
          // window.location.href = iframeLink;
          $('#terminalIFrame').attr( 'src', function ( i, val ) { return val; });
    }

    render() {


      return(
          <div id="terminal" className="reveal large" data-reveal="">
            <a className="button" onClick={this.refresh}>Refresh</a>
            <iframe id="terminalIFrame" src={iframeLink} width="100%" style={{
                border: "none"
            }} height="500px"></iframe>
          </div>
      );
    }
}

module.exports = Terminal;
