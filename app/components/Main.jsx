var React = require('react');
var Nav = require('Nav');
var Dashboard = require('Dashboard');
import firebase from 'app/firebase/';

class Main extends React.Component {

constructor(props) {
    super(props);
}

componentDidMount() {
    $(document).foundation();
}

render() {

    var iframeLink = "./offCrepe.html?";

    return (
        <div>

            <div className="off-canvas-wrapper">
                <div className="off-canvas-wrapper-inner" data-off-canvas-wrapper>
                    <div className="off-canvas position-right" data-position="right" id="offCanvas" data-off-canvas style={{
                        padding: 0
                    }}>
                        <div id="sensorDetails"></div>
                        <iframe id="sensorDetailsIFrame" src={iframeLink} width="350px" style={{
                            border: "none"
                        }} height="99%"></iframe>
                    </div>

                    <div className="off-canvas-content" data-off-canvas-content>
                        <Nav/>
                        <div className="row">
                            <div className="columns medium-12 large 12">
                              {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
};

module.exports = Main;
