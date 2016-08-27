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
          <div className="app-header">Uptime</div>
          <hr/>
          <ul className="tabs" data-tabs id="example-tabs">
              <li className="tabs-title is-active">
                  <a href="#panel1" aria-selected="true">Central</a>
              </li>
              <li className="tabs-title">
                  <a href="#panel2">North</a>
              </li>
              <li className="tabs-title">
                  <a href="#panel2">South</a>
              </li>
              <li className="tabs-title">
                  <a href="#panel2">East</a>
              </li>
              <li className="tabs-title">
                  <a href="#panel2">West</a>
              </li>
          </ul>

          <div className="tabs-content" data-tabs-content="example-tabs">
              <div class="tabs-panel is-active" id="panel1">
                  <p>Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.</p>
              </div>
              <div className="tabs-panel" id="panel2">
                  <p>Suspendisse dictum feugiat nisl ut dapibus. Vivamus hendrerit arcu sed erat molestie vehicula. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.</p>
              </div>
          </div>

      </div>
    );
  }
}

module.exports = Uptime;
