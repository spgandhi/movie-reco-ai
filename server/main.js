import { Meteor } from 'meteor/meteor';
import {Movies, Genres, MovieUsers, MoviesCollection} from '/imports/model.js';

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

      'movietomoviesim': function(itemId){
          movies = MoviesCollection.find().fetch();

          mainMovie = movies[itemId];
          similarityMatrix = mainMovie.similarity;

          for(i=0; i<similarityMatrix.length; i++){

            if(similarityMatrix[i].data.self.length==0)
              continue;

            denom1 = 0;
            denom2 = 0;
            numerator = 0


            otherMovieId = similarityMatrix[i].movieId;
            otherMovieSelf = similarityMatrix[i].data.self;
            otherMovieOther = similarityMatrix[i].data.other;

            for(j=0; j<otherMovieSelf.length; j++){
              rate1 = otherMovieSelf[j].rating;
              rate2 = otherMovieOther[j].rating;
              userAvg = MovieUsers.findOne({userId: otherMovieOther[j].userId}).avgRating;
              console.log('avg = ' + userAvg);
              console.log(rate1);
              console.log(rate2);
              rate1 = rate1 - userAvg;
              rate2 = rate2 - userAvg;
              console.log(rate1);
              console.log(rate2);
              numerator += rate1*rate2;
              console.log(numerator);

              denom1 += rate1*rate1;
              console.log(denom1)
              denom2 += rate2*rate2;
              console.log(denom2)
            }

            finalSim = numerator/(Math.sqrt(denom1) * Math.sqrt(denom2));
            console.log(finalSim);
            similarityMatrix[i].similarity = finalSim;
            mainMovie.similarity[i] = similarityMatrix[i];

          }
          MoviesCollection.update({movieId: mainMovie.movieId}, {$set: { similarity: mainMovie.similarity } } );

          console.log("similarity of " + itemId + " done ");
      },

      'similarityCalculation': function(staticMovie){
          movies = MoviesCollection.find().fetch();
          onHandMovie = movies[staticMovie];

          if(!onHandMovie.ratings)
            return;

          for(j=staticMovie; j<movies.length; j++){

              if(j==staticMovie)
                continue;

              movies1 = onHandMovie;
              movies2 = movies[j];
              item1 = '';
              item2 = '';

              item1 = onHandMovie.ratings;

              if(movies[j].ratings)
                item2 = movies[j].ratings;
              else
                continue;

                Ratings1 = [];
                Ratings2 = [];

              if(item1 != '' && item2 != ''){
                for(m=0; m<item1.length; m++){
                  for(n=0; n<item2.length; n++){
                    if(item1[m].userId == item2[n].userId){
                      Ratings1.push(item1[m]);
                      Ratings2.push(item2[n]);
                      // console.log(item1[m].rating + " & " + item2[n].rating + " by " + item1[m].userId + " for " + movies1.movieId + " & " + movies2.movieId);
                      console.log(Ratings1);
                      console.log(Ratings2);
                      break;
                    }
                  }
                }

                simj = {
                  movieId: movies2.movieId,
                  data: {
                    self: Ratings1,
                    other: Ratings2
                  }
                }

                simi = {
                  movieId: movies1.movieId,
                  data: {
                    self: Ratings2,
                    other: Ratings1
                  }
                }

                if(simi.data.self.length == 0)
                  continue;

                MoviesCollection.update({movieId: movies1.movieId}, {$push: {similarity: simj}});
                MoviesCollection.update({movieId: movies2.movieId}, {$push: {similarity: simi}});
                console.log("comparing " + onHandMovie.movieId + " & " + movies[j].movieId);


            }
          }
          // movies.map(function(item1){
            // movies.map(function(item2){
              //

            // })
          // })
      },

      'UserMovieMatrixCal' : function(){
        MovieUsers.find().fetch().map(function(user){
          user.moviesWatched.map(function(movie){
            data = {userId: user.userId, rating: movie.rating};
            MoviesCollection.update({movieId: movie.movieId}, { $push: {ratings: data} } );
          })
          console.log('user ' + user.userId + ' done.');

        })

      },

      'movieSimilarity': function(){

          MoviesC = MoviesCollection.find().fetch();

          for(i=1;i<2;i++){

            MoviesC.map(function(item){
              movieId1 = i
              movieId2 = item.movieId;
              if(movieId1 != movieId2){
                users = MovieUsers.find().fetch();
                users.map(function(user){
                  movie1R = '';
                  movie2R = '';

                  movie1Rating = [];
                  movie2Rating = [];

                  user.moviesWatched.map(function(movie){

                    if(movie.movieId == movieId1 || movie.movieId == movieId2){

                      if(movie.movieId == movieId1)
                        movie1R = movie.rating;
                      if(movie.movieId == movieId2)
                        movie2R = movie.rating;
                    }

                  })

                  if(movie1R != '' && movie2R != ''){
                      movie1Rating.push(movie1R);
                      movie2Rating.push(movie2R);
                  }

                })

                console.log(movie1Rating);
              }

            })

          }
      },

      'userAvgRating': function(){
          for(i=1;i<672; i++){
            user = MovieUsers.findOne({userId: i});
            console.log(user.moviesWatched);
            itemsTot = 0;
            RatingsTot = 0;

            user.moviesWatched.map(function(item){
              itemsTot++;
              RatingsTot += item.rating;
            })

            avgRating = RatingsTot/itemsTot;

            MovieUsers.update({ userId:i }, {$set: {'avgRating': avgRating} }  )
          }
      },

      'ratingsEntry': function(data, userId){
          console.log(data);
          MovieUsers.update({userId: userId}, { $push: {moviesWatched: data}});
          return true;
      },

      'similarityPrediction': function(){
        userRated = Meteor.users.findOne({_id: Meteor.userId}).ratings;
        console.log(userRated);
        movies = MoviesCollection.find().fetch();
        toBeConsidered = [];
        for(i=0; i<movies.length; i++){
          // console.log('hi1');
          num=0;
          denom = 0;
          for(j=0; j<movies[i].similarity.length; j++){
            // console.log('hi2');
            for(k=0;k<userRated.length;k++){
              // console.log( movies[i].similarity[j].movieId + " & " + userRated[k].movieId)
              if(movies[i].similarity[j].movieId == userRated[k].movieId){
                toBeConsidered.push(userRated[k], );
                num += movies[i].similarity[j].similarity * userRated[k].rating;
                denom += Math.abs(movies[i].similarity[j].similarity);
              }
            }
          }
          predicted = num/denom;
          Meteor.users.update( {_id: Meteor.userId}, {$push: {prediction: predicted} } );
        }

      },

      'getMovieInfo': function(name, ratings, comment, y_url){
        // var movie;
        // imdb.getReq( { name: name },  Meteor.bindEnvironment(function (error, things) {
        //   if(error){
        //     console.log(error);
        //     return;
        //   }else{
        //     movie = {};
        //     for(var key in things) {
        //         movie[key] = things[key];
        //     }
        //
        //     movie.self = {
        //       rating : ratings,
        //       comment: comment,
        //       y_url: y_url
        //     }
        //
        //     // console.log(movie);
        //     Movies.insert(movie);
        //
        //     movie.genres.split(', ').map((item)=>{
        //         if(Genres.find({'name':item}).count()==0){
        //           Genres.insert({'name': item});
        //         }
        //     })
        //
        //     return movie;
        //
        //   }
        //
        //
        // }));

        movie = MoviesCollection.findOne({title: name});
        data = {
          movieId: movie.movieId,
          rating: ratings
        }
        Meteor.users.update({_id: Meteor.userId}, {$push: {ratings: data}});
      }

      })

});
