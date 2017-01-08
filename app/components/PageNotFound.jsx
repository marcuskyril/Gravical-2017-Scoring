var React = require('react');
var {Link, IndexLink} = require('react-router');
var Nav = require('Nav');

class PageNotFound extends React.Component{
  componentDidMount() {
    $(document).foundation();
  }
  render() {
    return (
      <div>
        <Nav/>
        <div className="row textAlignCenter">
          <div className="columns large-12 margin-top-md">
              <h1>Are you lost?</h1>
              <Link to='/'>Back to dashboard</Link>
          </div>
        </div>
      </div>
    );
  }
};

module.exports = PageNotFound;
