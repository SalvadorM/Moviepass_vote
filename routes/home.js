const express = require('express');
const mongoose = require('mongoose');
const request = require('request');
const router = express.Router();

//The movie Databse API url
const movieURL = { url: 'https://api.themoviedb.org/3/movie/now_playing?api_key=73e9c32f5e534d529e1537f3b4f4ae38&language=en-US&page=1'};

router.get('/', function(req, res){
  request(movieURL, function(err, responce, body){
    var data = JSON.parse(body);
    var currentMovies = parseData(data.results);
    res.render('movies',{
      movies: currentMovies
    });
  });
});

function parseData(data){
  var movies = [];
  for(i = 0; i < data.length;i++){
    var url = 'https://image.tmdb.org/t/p/w185'+ data[i].poster_path;
    var curr = {
         'title': data[i].title,
         'vote': data[i].vote_average,
         'body': data[i].overview,
         'id': data[i].id,
         'poster': url
    };
    movies.push(curr);
  }
  movies.sort(function(a, b) { return b.vote - a.vote; });
  return movies.slice(0,10);
}

module.exports = router;
