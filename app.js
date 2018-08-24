const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//init app
const app = express();

//mongoose set up
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://salvador:1256rs@ds117848.mlab.com:17848/movie_poll', { useNewUrlParser: true })
  .then(() => console.log('Connect to database'))
  .catch(err => console.log(err));

//bd middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//enable cors
app.use(cors());

//set the view engine: pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//routes
const home = require('./routes/home');
const poll = require('./routes/poll');
app.use('/', home);
app.use('/poll', poll);
//begin server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Server started on port: ' + port));
