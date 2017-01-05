var React = require('react');
var Nav = require('Nav');
var Dashboard = require('Dashboard');
import SensorDetails from 'SensorDetails';
import {StickyContainer, Sticky} from 'react-sticky';
import firebase from 'app/firebase/';

class Main extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $(document).foundation();
    }

    render() {
        return (
            <div>
                <StickyContainer>
                    <Sticky>
                        <Nav/>
                    </Sticky>
                    <div>
                        {this.props.children}
                    </div>
                </StickyContainer>
            </div>
        );
    }
};

module.exports = Main;
