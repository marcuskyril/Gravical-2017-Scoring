var React = require('react');

var ErrorModal = React.createClass({

  componentDidMount: function() {
    var modal = new Foundation.Reveal($('#error-modal'));
    modal.open();
  },

  render: function() {
    return(
      <div id="error-modal" className="reveal tiny text-center" data-reveal="">
        <h4>Kyril</h4>
        <p>Will be successful.</p>
        <p>
          <button className="button hollow" data-close="">
            Damn right.
          </button>
        </p>
      </div>
    );
  }
});

module.exports = ErrorModal;
