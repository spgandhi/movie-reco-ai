import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import {Modal, Button} from 'react-materialize';
import Tabs from '/client/Tabs.jsx';

import TrackerReact from 'meteor/ultimatejs:tracker-react';

import {Movies} from '/imports/model.js';

// App component - represents the whole app
export default class MoviesHTML extends TrackerReact(React.Component) {

  constructor(){
    super();
    this.state = {
      subscription: {
        movie: Meteor.subscribe('movies')
      }
    }
  }

  shouldComponentUpdate(){
    console.log(this.props.filterText);
  }

  getMovies() {
      if(this.props.filterText && this.props.filterText != ''){
        return Movies.find({'genres': '/.*'+this.props.filterText+'.*/'}).fetch().reverse();
      }else{
        return Movies.find({}).fetch().reverse(); //fetch must be called to trigger reactivity
      }
   }


  render() {
    return (
      <div>
      {this.getMovies().map((movie)=>{
        return (
          <div className={"col s4 movie-wrapper " + movie.genres.split(',').map((item)=>{return item+' '})} key={movie.imdbid}>
            <div className="card">
              <div className="card-image waves-effect waves-block waves-light">
                <img className="activator" src={movie.poster} />
              </div>
              <div className="card-content">
                <p className="card-title activator grey-text text-darken-4">
                  {movie.title}
                  <Modal
                    header={movie.title}
                    trigger={
                      <a className="modal-action-btn"><i className="material-icons">more_vert</i></a>
                    }>
                    <div>
                      <Tabs tabClass={'tabular-'+movie.imdbid} movieId={movie.imdbid} movie={movie}/>
                    </div>
                  </Modal>
                </p>
                  <span>
                    <small>
                      {movie._year_data + '  '}
                      <i className="tiny material-icons">access_time</i> {movie.runtime}
                      <i className="tiny material-icons">star_rate</i> {movie.rating}
                    </small>
                  </span>
                  <div className="chip-wrapper">
                    {
                      movie.genres.split(', ').map((item)=>{
                        return (
                          <div key={item} className="chip">
                            {item}
                          </div>
                        )
                      })
                    }
                  </div>
              </div>
            </div>
          </div>
        )
      })}
      </div>
    );
  }
}
