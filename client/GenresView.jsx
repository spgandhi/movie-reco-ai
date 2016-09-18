import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import { browserHistory } from 'react-router'

import TrackerReact from 'meteor/ultimatejs:tracker-react';

import {Genres} from '/imports/model.js';

export default class GenresView extends TrackerReact(React.Component) {

  constructor(props){
    super(props);
    previousFilter = ''
    this.state = {
      subscription: {
        genres: Meteor.subscribe('genres'),
        previousFilter: ''
      }
    }
  }

  getGenres(){
    return Genres.find().fetch();
  }

  genreClick(filter, event){
    event.preventDefault();
    console.log(filter);


    if(filter == 'All'){
      $('.movie-wrapper').show();
      $('.genre-chip').css({border: 'initial'});
      $('#genre-All').css({border: '3px solid #26a69a'});
    }else{
      $('.movie-wrapper').hide();
      $('.'+filter).show();
      $('.genre-chip').css({border: 'initial'});
      $('#genre-'+filter).css({border: '3px solid #26a69a'});

    }
  }

  render() {
    divStyle = {
      'textAlign' : 'center'
    }
    return (
      <div className="row" style={divStyle}>
        <div className="chip genre-chip" id="genre-All" onClick={this.genreClick.bind(event, 'All')}>All</div>
        {this.getGenres().map((item)=>{
          return (
            <div key={item._id} className="chip genre-chip" id={"genre-" + item.name} onClick={this.genreClick.bind(event, item.name)}>
              {item.name}
            </div>
          )
        })}

      </div>
    );
  }
}
