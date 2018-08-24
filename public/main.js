function displayTY(){
  $('html, body').animate({
    scrollTop: $("#voted").offset().top
  }, 1000);
  $('#voted').fadeIn(1000);
   setTimeout(function() {
       $('#voted').fadeOut(1000);
   }, 3000);
}

$(function(){
  //Add event listener to all buttons
  //and send POST to poll
  var form = $('button.mb');

  form.on('click', function(){
     const choice = this.id;
     const data = { movie: choice };

    $.post('https://moviepasspoll.herokuapp.com/poll', data, function(data, status){
      console.log(data);
      displayTY();
    });
  });

  //Add the movies to dataPoints, to create graph
  var dataDB = $('.card-body');
  var dataPoints = [];
  $.each(dataDB, function(index, val){
    var title = $(this)[0].firstChild.innerText;
    var movID = $(this)[0].lastChild.id;
      dataPoints.push({
        label: title,
        y: 0,
        id: movID
         });
  });

  $.get('https://moviepasspoll.herokuapp.com/poll', function(data, status){
    const votesAll = data.votes;
    //get the movies that have votes
    //and creates array with all ID : votes
    const voteCounts = votesAll.reduce(function(acc, vote){
      acc[vote.movie] = (acc[vote.movie] || 0) + vote.votes
      return acc;
    }, {});


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
       dataPoints = dataPoints.map(function(x){
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

  //toggle the graph
  $('#chartButton').click(function() {
    var graphSec = $('.graphSection');
    graphSec.toggleClass('toggleGraph')
  });

  //make movies animation
  $('.col-md-3').each(function(e){
    setTimeout(function(){
      $('.col-md-3').eq(e).css('opacity','1');
    }, 100 * (e+1));
  });

});
