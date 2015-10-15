$(function() {

  // Framework 7 Functionalities

  // Initialize app
  var myApp = new Framework7();

  myApp.searchResultsTemplate = Template7.compile($('#search-results-template').html());
  myApp.homeItemsTemplate = Template7.compile($('#home-items-template').html());

  // Add view
  var mainView = myApp.addView('.view-main', {
      dynamicNavbar: true,
  });

  // Search Songs
  var searchTimeout;
  myApp.searchLocation = function (search) {
      var query = encodeURIComponent('select * from geo.places where text="' + search + '"');
      var q = 'http://query.yahooapis.com/v1/public/yql?q=' + query + '&format=json';
      if (searchTimeout) clearTimeout(searchTimeout);
      $('.popup .preloader').show();
      searchTimeout = setTimeout(function () {
          $.getJSON(q, function (results) {
              var html = '';
              
              $('.popup .preloader').hide();
              if (results.query.count > 0) {
                  var places = results.query.results.place;
                  html = myApp.searchResultsTemplate(places);
              }
              $('.popup .search-results').html(html);
          });
      }, 300);
  };

  // Handle search results
  $('.popup input[type="text"]').on('change keyup keydown', function () {
      console.log(this.value);
      myApp.searchLocation(this.value);
  });
  $('.popup').on('closed', function () {
      $('.popup input[type="text"]').val('');
      $('.popup .search-results').html('');
      $('.popup .preloader').hide();
  });
  $('.popup').on('open', function () {
      $('.views').addClass('blured');
      $('.statusbar-overlay').addClass('with-popup-opened');
  });
  $('.popup').on('opened', function () {
      $('.popup input[type="text"]')[0].focus();
  });
  $('.popup').on('close', function () {
      $('.views').removeClass('blured');
      $('.popup input[type="text"]')[0].blur();
      $('.statusbar-overlay').removeClass('with-popup-opened');
  });

  // Sockets and jQuery
  var socket = io();
  var options = [];

  x = Cookies.get('dj-cookie');

  $('form').submit(function(event) {
    event.preventDefault();
    var opt = $('option[value="' + $('#song').val() + '"]');
    socket.emit('new song', {
      song: options[opt.attr('id')],
      party: $('#party-name').attr('data')
    });
    $('#song').val('');
    return false;
  });

  $('ul').on("click",'#upvote',function(){
    console.log('first click');
    socket.emit('new vote',{
      song: $(this).parent().attr('id'),
      party: $('#party-name').attr('data'),
      cookie: x
    });
  });

  $('form').on('keypress','#song',function(song){
    var $song_input =$('#song').val();
    if ($song_input.length > 4){
      $.ajax({
        url: 'http://ws.spotify.com/search/1/track.json?q='+$song_input
        }).success(function(response){
          console.log($song_input);
        autocomplete(response);
      });
    }
  });

  socket.on('new song', function(song) {
    var currentPartyId = $('#party-name').attr('data');
    var $songOption = $('#' + song.id);
    console.log(song.partyId);
    // console.log($songOption.text() === "");
    if (song.partyId == currentPartyId){
      console.log('THEREEREERE')
      if ($songOption.text() === ""){
        $('#songs').append('<li id="' +  song.id + '">' + '<i class="fa fa-thumbs-up" id="upvote"></i>'+ song.title + '  VoteCount: <span>' + song.voteCount + '</span></li>');
      }
      else {
        $songOption.find('span').text(song.voteCount);
      }
    }
  });

  socket.on('new vote',function(song){
    var $songToIncrement = $('#' + song.id);
    if ($songToIncrement.text() === ""){
      $('#songs').append("VoteCount: <span>" + song.voteCount + "</span></li>");
    }else{
      $songToIncrement.find('span').text(song.voteCount);
    }
  });

  //for error handing in the song input
  socket.on('error', function(){
    alert('The song name you entered is not valid!');
  });

  function autocomplete(data){
    if (data.tracks) {
      var $matching_songs = $('#matching-songs');
      $matching_songs.empty();
      var tracks = data.tracks;
      options = [];
      for(var i=0;i<5;i++){
          var track = tracks[i];
          if (track) {
            options[i] = tracks[i];
            var result = '<option id="' + i + '" value="' + track.name + ' by ' + track.artists[0].name + '">' + track.name + ' by '+track.artists[0].name +'</option>';
            $matching_songs.append(result);
          }
      }
    }
  }

});


