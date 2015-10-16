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
    // var query = encodeURIComponent('select * from geo.places where text="' + search + '"');
    // var q = 'http://query.yahooapis.com/v1/public/yql?q=' + query + '&format=json';
    if (searchTimeout) clearTimeout(searchTimeout);
    $('.popup .preloader').show();
    searchTimeout = setTimeout(function () {
    $.ajax({
      url: 'http://ws.spotify.com/search/1/track.json?q='+search
      }).success(function(response){
        var html = '';
          console.log(response);
          $('.popup .preloader').hide();
          if (response.tracks.length > 0) {
              var songs = response.tracks;
              console.log("hello there",songs);
              html = myApp.searchResultsTemplate(songs);
          }
          $('.popup .search-results').html(html);
        }
    );
    }, 300);
  };

  // Get locations weather data
  myApp.updateWeatherData = function (callback) {
    var woeids = [];
    if (!localStorage.w7Places) return;
    var places = $.parseJSON(localStorage.w7Places);
    if (places.length === 0) {
        localStorage.w7Data = JSON.stringify([]);
        return;
    }
    if (!navigator.onLine) {
        myApp.alert('You need internet connection to search for songs');
    }
    for (var i = 0; i < places.length; i++) {
        woeids.push(places[i].woeid);
    }
    var query = encodeURIComponent('select * from weather.forecast where woeid in (' + JSON.stringify(woeids).replace('[', '').replace(']', '') + ') and u="c"');
    var q = 'http://query.yahooapis.com/v1/public/yql?q=' + query + '&format=json';
    myApp.showIndicator();
    $.get(q, function (data) {
      var weatherData = [];
      myApp.hideIndicator();
      data = $.parseJSON(data);
      if (!data.query || !data.query.results) return;
      var places = data.query.results.channel;
      var place;
      if ($.isArray(places)) {
          for (var i = 0; i < places.length; i++) {
              place = places[i];
              weatherData.push({
                  city: place.location.city,
                  country: place.location.country,
                  region: place.location.region,
                  humidity: place.atmosphere.humidity,
                  pressure: place.atmosphere.pressure,
                  sunrise: place.astronomy.sunrise,
                  sunset: place.astronomy.sunset,
                  wind: place.wind,
                  condition: place.item.condition,
                  forecast: place.item.forecast,
                  lat: place.item.lat,
                  long: place.item.long,
                  woeid: woeids[i]
              });
          }
      }
      else {
          place = places;
          weatherData.push({
              city: place.location.city,
              country: place.location.country,
              region: place.location.region,
              humidity: place.atmosphere.humidity,
              pressure: place.atmosphere.pressure,
              sunrise: place.astronomy.sunrise,
              sunset: place.astronomy.sunset,
              wind: place.wind,
              condition: place.item.condition,
              forecast: place.item.forecast,
              lat: place.item.lat,
              long: place.item.long,
              woeid: woeids[0]
          });
      }
      localStorage.w7Data = JSON.stringify(weatherData);
      if (callback) callback();
  });
};
// Build list of places on home page
myApp.buildWeatherHTML = function () {
    var weatherData = localStorage.w7Data;
    if (!weatherData) return;
    $('.places-list ul').html('');
    weatherData = $.parseJSON(weatherData);
    var html = myApp.homeItemsTemplate(weatherData);
    $('.places-list ul').html(html);
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
  $('.popup .search-results').on('click', 'li', function () {
    var li = $(this);
    var woeid = li.attr('data-woeid');
    var city = li.attr('data-city');
    var country = li.attr('data-country');
    var places;
    if (localStorage.w7Places) places = $.parseJSON(localStorage.w7Places);
    else places = [];
    places.push({
        woeid: li.attr('data-woeid'),
        city: li.attr('data-city'),
        country: li.attr('data-country')
    });
    localStorage.w7Places = JSON.stringify(places);
    myApp.updateWeatherData(function () {
        myApp.buildWeatherHTML();
    });
  });

  // Update html and weather data on app load
  myApp.buildWeatherHTML();
  myApp.updateWeatherData(function () {
      myApp.buildWeatherHTML();
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

  $('ul').on("click","#delete",function(){
    console.log("delete button");
    socket.emit('delete song',{
      song: $(this).parent().attr('id'),
      party: $('#party-name').attr('data')
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
      console.log('THEREEREERE');
      if ($songOption.text() === ""){
        $('#songs').append('<li id="' +  song.id + '">' + '<i class="fa fa-thumbs-up" id="upvote"></i>'+ song.title + '  VoteCount: <span>' + song.voteCount + '</span>'+'<i class="fa fa-trash-o" id="delete"></i>'+'</li>');
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

  socket.on('deleted song',function(obj){
    $('#' + obj.song).remove();
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


