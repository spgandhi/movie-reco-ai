import { Meteor } from 'meteor/meteor';
import {Movies, Genres} from '/imports/model.js';

var imdb = require('imdb-api');
Meteor.startup(() => {
  // code to run on server at startup

  Meteor.publish('users', function(){
    return Meteor.users.find();
  })

  Meteor.publish('movies', function(){
    return Movies.find();
  })

  Meteor.publish('genres', function(){
    return Genres.find();
  })

  Meteor.methods({
      'getMovieInfo': function(name, ratings, comment, y_url){
        var movie;
        imdb.getReq( { name: name },  Meteor.bindEnvironment(function (error, things) {
          if(error){
            console.log(error);
            return;
          }else{
            movie = {};
            for(var key in things) {
                movie[key] = things[key];
            }

            movie.self = {
              rating : ratings,
              comment: comment,
              y_url: y_url
            }

            // console.log(movie);
            Movies.insert(movie);

            movie.genres.split(', ').map((item)=>{
                if(Genres.find({'name':item}).count()==0){
                  Genres.insert({'name': item});
                }
            })

          }


        }));
      }

      })

});
