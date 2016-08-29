var React = require('react');

class Uptime extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(document).foundation();
  }

  render() {
    return (
      <div className="uptime-wrapper">
           

      </div>
    );
  }
}

module.exports = Uptime;
