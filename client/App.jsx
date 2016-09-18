import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';
import { browserHistory } from 'react-router'

import GenresView from '/client/GenresView.jsx';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import Add from '/client/Add.jsx';

import MoviesHTML from '/client/MoviesHTML.jsx';
// App component - represents the whole app
class LogoutButton extends Component{
  constructor(){
    super();
    this.logout = this.logout.bind(this);
  }

  logout(e){
    e.preventDefault();
    Meteor.logout();
  }

  render() {
    return(
        <button onClick={this.logout}>Logout</button>
    )

  }
}
export default class App extends TrackerReact(React.Component) {

  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
    this.state = {
      subscription: {
        movie: Meteor.subscribe('movies')
      },
      isAuthenticated: this.getMeteorData(),
      logoutButton : '',
      AddOption : '',
      moviesHtml : <MoviesHTML />
    }
  }

  getMeteorData(){
   return Meteor.userId() !== null ;
  }

  componentWillMount(){
    if (!this.state.isAuthenticated) {
      this.state.logoutButton = '';
    }else{
      this.state.logoutButton = <LogoutButton />;
      this.state.AddOption = <Add />;
    }
  }

  componentDidUpdate(prevProps, prevState){
    if (!this.state.isAuthenticated) {
      this.state.logoutButton = '';
    }else{
      this.state.logoutButton = <LogoutButton />;
      this.state.AddOption = <Add />;
    }
  }

  logout(e){
    e.preventDefault();
    Meteor.logout();
    this.state.logoutButton = '';
    this.state.AddOption = '';
  }

   initializeModal(id){
     console.log('initialized ' + id);
     id1 = 'movie'+id;
     $('.'+id1).leanModal();
     return '';
   }

   updateMovies(event){
     event.preventDefault();
     var filter = ReactDOM.findDOMNode(this.refs.filterText).value.trim();
     this.state.filterText = filter;
     console.log(this.state.filterText);
     this.state.moviesHtml = 'Alone';

     if(filter == 'All'){
       $('.movie-wrapper').show();
     }else{
       $('.movie-wrapper').hide();
       $('.'+filter).show();

     }

    //  console.log(Movies.find({'genres': {$regex : ".*" +filter+ ".*"}}).fetch());
    //  return Movies.find({'genres': '/.*'+filter+'.*/'}).fetch();

   }

   logoutButton(){
       return (
         <button onClick={this.logout}>Logout</button>
       )
   }

  render() {
    return (
      <div className="container">
        {this.state.logoutButton}
        <div className="row">
          <header>Movies</header>
        </div>

        {this.state.AddOption}
        <GenresView />
        <div className="row">
          {this.state.moviesHtml}
        </div>
      </div>
    );
  }
}
