import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import {HTTP} from 'meteor/http';

import {MoviesCollection} from '/imports/model.js';
import {MovieUsers} from '/imports/model.js';

// App component - represents the whole app
export default class Admin extends Component {
	constructor(){
    super();
  }

	processFile(){
		HTTP.get(Meteor.absoluteUrl("/movies-small.json"), function(err,result) {
			total = result.data.length;
    	for(i=0; i<result.data.length; i++){

				data = {
					movieId: result.data[i].movieId,
					title : result.data[i].title,
					genres : result.data[i].genres.split('|')
				}

				MoviesCollection.insert(data);
				document.getElementById("moviesImportPert").style.width = (i/total)*100 + "%";
				document.getElementById("progress-pert").innerHTML = (i/total)*100 + " %";

			}
		});

	}

	importUsers(){
		HTTP.get(Meteor.absoluteUrl("/movies-small.json"), function(err,result) {
			total = 671;
			for(i=1; i<672;i++){
				MovieUsers.insert({
					userId: i,
					moviesWatched: []
				})
				document.getElementById("moviesImportPert").style.width = (i/total)*100 + "%";
				document.getElementById("progress-pert").innerHTML = (i/total)*100 + " %";
			}
		})
	}


	RatingMatrixCalculation(){
		console.log('in rating matrix cal');
		HTTP.get(Meteor.absoluteUrl("/ratings-small.json"), function(err,result) {
			data = result.data;
			console.log(data.length);
			for(i=0;i<data.length;i++){
				newData = {
					movieId : data[i].movieId,
					rating : data[i].rating,
					timestamp : data[i].timestamp
				}

				if(newData.movieId >12)
					continue;

				Meteor.call('ratingsEntry', newData, data[i].userId, function(){
					document.getElementById("moviesImportPert").style.width = (i/data.length)*100 + "%";
					document.getElementById("progress-pert").innerHTML = (i/data.length)*100 + " %";
					if(i%100 == 0){
						console.log(newData);
					}
				})

			}
		})
	}

	movieSimilarity(){

		Meteor.call('movieSimilarity', function(){
			console.log('movie similarity done');
		})
	}

	UsersAverageRating(){
			Meteor.call('userAvgRating')
	}

	UserMovieMatrixCal(){
		Meteor.call('UserMovieMatrixCal', function(){
			console.log('user movie matrix cal done');
		})
	}

	similarityCalculation(){

		for(i=0; i<12; i++){
			Meteor.call('similarityCalculation', i, function(){
				console.log('similarity Calculated');
			})
		}

	}

	movietomoviesim(){
		for(i=0; i<12; i++){
			Meteor.call('movietomoviesim', i, function(){
				console.log('movietomoviesim done');
			})
		}
	}

	similarityPrediction(){
		Meteor.call('similarityPrediction', function(){
			console.log('prediction completed');
		})
	}

	render() {
	    return (
	      <div className="container">
	        Admin
					<div className="progress">
      			<div className="determinate" id= "moviesImportPert" style={{width: "0%"}}></div>
  				</div>
					<div id="progress-pert">0 %</div>
					<ul>
		        <ol><button className="btn btn-primary spc" onClick={this.processFile.bind(this)}>Import Movies</button></ol>
						<ol><button className="btn btn-primary spc" onClick={this.importUsers.bind(this)}>Import Users</button></ol>
						<ol><button className="btn btn-primary spc" onClick={this.RatingMatrixCalculation.bind(this)}>User Rating Matrix</button></ol>
						<ol><button className="btn btn-primary spc" onClick={this.UsersAverageRating.bind(this)}>Users Avg Rating</button></ol>
						<ol><button className="btn btn-primary spc" onClick={this.UserMovieMatrixCal.bind(this)}>User Item Matrix Cal</button></ol>
						<ol><button className="btn btn-primary spc" onClick={this.similarityCalculation.bind(this)}>Movie Similarity Cal</button></ol>
						<ol><button className="btn btn-primary spc" onClick={this.movietomoviesim.bind(this)}>Movie Similarity Final</button></ol>
						<ol><button className="btn btn-primary spc" onClick={this.similarityPrediction.bind(this)}>Predict</button></ol>
					</ul>
	      </div>
	    );
	}
}
