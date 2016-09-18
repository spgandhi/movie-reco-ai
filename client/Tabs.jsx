import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

// App component - represents the whole app
export default class Tabs extends Component {
  componentDidMount(){
      console.log('tabs init');
      $('.tabs.'+this.props.tabClass).tabs();
  }

  render() {

    youtubeStyle = {
      textAlign: 'center'
    }

    return (
      <div className="row">
        <div className="col s12">
          <ul className={'tabs modal-tabs ' + this.props.tabClass}>
            <li className="tab col s3"><a className="active" href={"#tab-summary"+this.props.movieId}>Summary</a></li>
            <li className="tab col s3"><a  href={"#tab-some1"+this.props.movieId}>Basic Info</a></li>
            <li className="tab col s3"><a  href={"#tab-ytube"+this.props.movieId}>Trailer</a></li>
          </ul>
        </div>
        <div id={'tab-summary'+this.props.movieId} className="col s12"><div>{this.props.movie.plot}</div></div>
        <div id={'tab-some1'+this.props.movieId} className="col s12">
          <ul>
            <li>Director : {this.props.movie.director} </li>
            <li>Write : {this.props.movie.writer} </li>
            <li>Actors : {this.props.movie.actors} </li>
            <li>Genres : {this.props.movie.genres} </li>
          </ul>
        </div>
        <div id={'tab-ytube'+this.props.movieId} className="col s12"  style={youtubeStyle}>
          <iframe width="560" height="315" src={"https://www.youtube.com/embed/" + this.props.movie.self.y_url} frameBorder="0" allowFullScreen></iframe>
        </div>
      </div>
    );
  }
}
