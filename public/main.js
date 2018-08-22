// Request movieDB for 20 current films that are showing
//and puts them in the object argument
function setMovies () {
  var moviesArr = [];
  $.getJSON("https://api.themoviedb.org/3/movie/now_playing?api_key=73e9c32f5e534d529e1537f3b4f4ae38&language=en-US&page=1",
    function(data) {
      $.each(data.results, function(index, value){
        var url = 'https://image.tmdb.org/t/p/w185'+ value.poster_path;
        var idAttr = value.id.toString();

        var curr = {
          'title': value.title,
          'vote': value.vote_average,
          'body': value.overview,
          'id': value.id,
          'poster': url
        };
         moviesArr.sort(function(a, b) { return b.vote - a.vote; });
        moviesArr.push(curr);
        $('.row').append('<div class="col-md-3"><div class="card"><img class="card-img-top" src="' + curr.poster + '"alt="movies"> <div class="card-body"><h5 class="card-title">'+ curr.title +'</h5><button name="movie" type="submit" class="btn btn-outline-primary mb" id="'+ curr.id +'">Vote</button></div><div class="card-footer"><small class="text-muted">Rating: '+ curr.vote +'</small></div></div> ');

      });
  }).done(test);
  return moviesArr;
}

//set the rest of the page after the we get the information from movieDB api
function test(){
  //show all cards after the cards were loaded
  $('.col-md-3').each(function(e){
    setTimeout(function(){
      $('.col-md-3').eq(e).css('opacity','1');
    }, 100 * (e+1));
  });

  //Add event listener to all buttons
  //and send POST to poll
  var form = $('button.mb');

  form.on('click', function(){
     const choice = this.id;
     const data = { movie: choice };

     fetch('https://moviepasspoll.herokuapp.com/poll', {
       method: 'post',
       body: JSON.stringify(data),
       headers: new Headers({
         'Content-Type': 'application/json'
       })
     })
      .then(function(res) {
        res.json()})
      .then(function(data){
        console.log(data)})
      .catch(function(err){
        console.log(err)});
  });

  //Add the movies to dataPoints, to create graph
  var dataPoints = [];
  $.each(dataDB, function(key, value){
    dataPoints.push({
      label: value.title,
     y: 0,
      id: value.id
       });
  });


  //Get the data from database
  fetch('https://moviepasspoll.herokuapp.com/poll')
    .then(function(res){res.json()})
    .then(function(data){

      const votesAll = data.votes;
      //get the movies that have votes
      //and creates array with all ID : votes
      const voteCounts = votesAll.reduce(
        (acc, vote) =>
          ((acc[vote.movie] = (acc[vote.movie] || 0) + vote.votes), acc), {});

      //Add in the the information from the database if the movie has votes
      $.each(dataPoints, function(key, val){
        //val is the id for the database
        $.each(voteCounts, function(i, value){
          if ( val.id == parseInt(i)){
            val.y = value;
          }
        });
      });

      //Create chart in document
      const chartCon = $('#chartContainer');
      if (chartCon) {
        var chart = new CanvasJS.Chart("chartContainer", {
           animationEnabled: true,
            theme: "theme1",
            title: {
                text: "Top 10 Choices"
             },
            axisY: {
                title: "Units",
                titleFontSize: 24
              },
             data: [{
               type: "column",
               dataPoints: dataPoints
             }]
          });
        chart.render();


        // Enable pusher logging
       Pusher.logToConsole = false;

       var pusher = new Pusher('e06ae81fe7ba85abcccb', {
         cluster: 'us2',
         encrypted: true
       });

       var channel = pusher.subscribe('movie-poll');

       //we map through dataPoints and see which ID matches the data.id
       //if the movie is in top 10, then we add the vote to dataPoints
       channel.bind('movie-vote', function(data) {
         dataPoints = dataPoints.map(x => {
           if(x.id == data.movie){
             x.y += data.votes;
             return x;
           }
           else {
             return x;
           }
         });
         chart.render();
       });
     }
  });
}

var dataDB = setMovies();

$('#chartButton').click(function() {
  var graphSec = $('.graphSection');
  graphSec.toggleClass('toggleGraph')
});
