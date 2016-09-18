import { Mongo } from 'meteor/mongo';

export const Movies = new Mongo.Collection('movies');

export const Genres = new Mongo.Collection('genres');
