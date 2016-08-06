var React = require('react');

var About = (props) => {
  return (
    <div>
      <h1 className="text-center page-title">Filter</h1>
      <p>Bonsoir.</p>
      <p>
        Here are some links:
      </p>
      <ul>
        <li>
          <a href="http://www.nba.com">NBA</a>
        </li>
        <li>
          <a href="https://facebook.github.io/react">React</a>
        </li>
      </ul>
    </div>
  );
};

module.exports = About;
