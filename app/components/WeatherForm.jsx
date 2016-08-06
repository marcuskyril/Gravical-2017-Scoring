var React = require('react');

var WeatherForm = React.createClass({
    onFormSubmit: function(e) {
        e.preventDefault();

        var location = this.refs.location.value;

        if (location.length > 0) {
            this.refs.location.value = "";
            this.props.onSearch(location);
        }
    },
    render: function() {
        return (
            <div>

                <form onSubmit={this.onFormSubmit}>
                    <div className="row">
                        <div className="large-6 columns">
                            <label>Display Period
                                <select>
                                    <option value="">Display Period</option>
                                    <option value="husker">#</option>
                                    <option value="starbuck">#</option>
                                    <option value="hotdog">#</option>
                                    <option value="apollo">#</option>
                                </select>
                            </label>
                        </div>
                        <div className="large-6 columns">
                            <label>Interval
                                <select>
                                    <option value="">Interval</option>
                                    <option value="husker">#</option>
                                    <option value="starbuck">#</option>
                                    <option value="hotdog">#</option>
                                    <option value="apollo">#</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="large-3 columns">
                            <input type="submit" className="button hollow expanded" value="Bite me"/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});

module.exports = WeatherForm;
