const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


//create app
const app = express();

const poll = require('./routes/poll');
//Routing to public
app.use(express.static(path.join(__dirname, 'public')));

//body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//enable cors
app.use(cors());

app.use('/poll', poll);

const port = process.env.PORT || 8080;

//begin server
app.listen(port, () => console.log('Server started on port: ' + port));


//mongoose set up
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://salvador:1256rs@ds117848.mlab.com:17848/movie_poll')
  .then(() => console.log('Connect to database'))
  .catch(err => console.log(err));
