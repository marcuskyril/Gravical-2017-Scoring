var React = require('react');

class Terminal extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {

      var iframeLink = "http://opsdev.sence.io:4200/";

      return(
        <div id="terminal" className="reveal large" data-reveal="">
          <iframe id="sensorDetailsIFrame" src={iframeLink} width="100%" style={{
              border: "none"
          }} height="500px"></iframe>
        </div>
      );
    }
}

module.exports = Terminal;
