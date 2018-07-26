const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var voteShe = new Schema({
  movie: {
    type: Number,
    required: true
  },
  votes: {
    type: Number,
    require: true
  }
});

//Schema
const Vote = mongoose.model('Vote', voteShe);

module.exports = Vote;
