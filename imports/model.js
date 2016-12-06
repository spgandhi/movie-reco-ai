import { Mongo } from 'meteor/mongo';

export const Movies = new Mongo.Collection('movies');

export const Genres = new Mongo.Collection('genres');

export const MoviesCollection = new Mongo.Collection('movies-collection');

export const MovieUsers = new Mongo.Collection('movie-users');

MovieUsers.allow({
  update: function (userId, doc, fields, modifier) {
    return true;
  },

  insert: function(){
    return true;
  }
});
