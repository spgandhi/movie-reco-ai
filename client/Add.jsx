import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

// App component - represents the whole app
export default class Add extends Component {
  handleSubmit(event){
    event.preventDefault();
    const movie_name = ReactDOM.findDOMNode(this.refs.movie_name).value.trim();
    const ratings = ReactDOM.findDOMNode(this.refs.ratings).value.trim();
    const comment = ReactDOM.findDOMNode(this.refs.comment).value.trim();
    const y_url = ReactDOM.findDOMNode(this.refs.y_url).value.trim();

    Meteor.call('getMovieInfo', movie_name , ratings, comment, y_url, function(err, response){
      console.log(response);
      console.log(err);
    })
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <header>Add Movies</header>
        </div>
        <div>
          <div className="row">
            <form className="col s12">
              <div className="row">
                <div className="input-field col s6">
                  <input placeholder="Placeholder" ref="movie_name" type="text" className="validate" />
                  <label>Movie Name</label>
                </div>
                <div className="input-field col s6">
                  <input ref="ratings" type="text" className="validate" />
                  <label>Ratings</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input ref="y_url" type="text" className="validate" />
                  <label>yoututbe url</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <textarea ref="comment" className="materialize-textarea"></textarea>
                  <label>Textarea</label>
                </div>
              </div>
              <div className="button">
                <a className="waves-effect waves-light btn" onClick={this.handleSubmit.bind(this)}>Submit</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
