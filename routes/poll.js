const Vote = require('../models/movieVotes')
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Pusher = require('pusher');

var pusher = new Pusher({
  appId: '564351',
  key: 'e06ae81fe7ba85abcccb',
  secret: 'ef75e866ee5ce792cb76',
  cluster: 'us2',
  encrypted: true
});


router.get('/', (req, res) => {
  Vote.find()
    .then(votes => res.json({success: true, votes: votes}));
});

router.post('/', (req, res)=> {
  //create object for post,
  //votes are 1
  var newVote = {
    movie: parseInt(req.body.movie),
    votes: 1
  }

  //send the object to database
  new Vote(newVote).save()
  .then(vote => {
    pusher.trigger('movie-poll', 'movie-vote', {
      votes: vote.votes,
      movie: vote.movie
    });

    return res.json({success: true, message: 'Vote submitted'});
  });
});
module.exports = router;
