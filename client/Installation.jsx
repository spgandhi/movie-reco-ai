import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { browserHistory } from 'react-router';
import {Accounts} from 'meteor/accounts-base';

import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class Installation extends TrackerReact(React.Component) {
  constructor(props){
    super(props);

    this.state = {
      subscription: {
        users: Meteor.subscribe('users')
      },
      users: this.getMeteorData()
    }
  }

  getMeteorData(){
   return Meteor.users.find().fetch();
  }

  componentWillMount(){
    console.log(Meteor.users.find().fetch());
    console.log(Meteor.users.find().count());
    console.log(Meteor.users.find().count() > 0);
    if (Meteor.users.find().count()>0) {
      console.log(Meteor.users);
      browserHistory.push('/login');
    }
  }

  shouldComponentUpdate(){
    console.log(Meteor.users.find().fetch());
    console.log(Meteor.users.find().count());
    console.log(Meteor.users.find().count() > 0);
    if (Meteor.users.find().count()>0) {
      console.log(Meteor.users);
      browserHistory.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState){
    console.log(Meteor.users);
    if (Meteor.users.find().count()>0) {
      console.log(Meteor.users);
      browserHistory.push('/login');
    }
  }

  handleSubmit(){
    event.preventDefault();

    const email = ReactDOM.findDOMNode(this.refs.email).value.trim();
    const password = ReactDOM.findDOMNode(this.refs.password).value.trim();

    // Meteor.call('adminUser', email , password, function(err, response){
    //   console.log(response);
    //   console.log(err);
    // })
    if(Meteor.users.find().count()>0){
      console.log('There is already a admin user');
      return;
    }
    Accounts.createUser({email: email, password: password}, function(err) {
      if (err)
        console.log(err);
      else
        console.log('success!');
    });

  }

  getUser(){
      if(Meteor.users.find().count>0)
        browserHistory.push('/login');
      return Meteor.users.find().fetch();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s12">
                <input ref="email" type="email" className="validate" />
                <label>Email</label>
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input ref="password" type="password" className="validate" />
                <label>Password</label>
              </div>
            </div>
            <div className="button">
              <a className="waves-effect waves-light btn" onClick={this.handleSubmit.bind(this)}>Submit</a>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
