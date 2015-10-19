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
      url: 'https://api.spotify.com/v1/search',
      data: {
        q: search,
        type: 'track'
      },
      success: function(response){
        console.log(response.tracks.items);
        var html = '';
          $('.popup .preloader').hide();
          if (response.tracks.items.length > 0) {
              var songs = response.tracks.items;
              console.log("hello there",songs);
              html = myApp.searchResultsTemplate(songs);
          }
          $('.popup .search-results').html(html);
        }
    });
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
    // var songData = $(this)[0].dataset;
    var songData = $(this)[0].dataset;
    socket.emit('new song', {
      song: songData,
      partyId: $('#party-name').attr('data')
    });
    // var woeid = li.attr('data-woeid');
    // var city = li.attr('data-city');
    // var country = li.attr('data-country');
    // var places;
    // if (localStorage.w7Places) places = $.parseJSON(localStorage.w7Places);
    // else places = [];
    // places.push({
    //     woeid: li.attr('data-woeid'),
    //     city: li.attr('data-city'),
    //     country: li.attr('data-country')
    // });
    // localStorage.w7Places = JSON.stringify(places);
    // myApp.updateWeatherData(function () {
    //     myApp.buildWeatherHTML();
    // });
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
    var opt = $('#usernameinput').val();
    console.log(opt);
    // socket.emit('new song', {
    //   song: options[opt.attr('id')],
    //   party: $('#party-name').attr('data')
    // });
    // $('#song').val('');
    return false;
  });

  $('ul.songs-list').on("click",'#upvote',function(){
    console.log('upvote',$(this).parent().parent().find(".city").attr('id'));
    socket.emit('new vote',{
      song: $(this).parent().parent().find(".city").attr('id'),
      party: $('#party-name').attr('data'),
      cookie: x
    });
  });

  $('ul.songs-list').on("click","#delete",function(){
    console.log("delete button",$(this).parent());
    socket.emit('delete song',{
      song: $(this).parent(".city").attr('id'),
      party: $('#party-name').attr('data')
    });
  });

  // $('form').on('keypress','#song',function(song){
  //   var $song_input =$('#song').val();
  //   if ($song_input.length > 4){
  //     $.ajax({
  //       url: 'http://ws.spotify.com/search/1/track.json?q='+$song_input
  //       }).success(function(response){
  //         console.log($song_input);
  //       autocomplete(response);
  //     });
  //   }
  // });

  socket.on('new songed', function(song) {
    html = myApp.buildWeatherHTML(song);
    var currentPartyId = $('#party-name').attr('data');
    var $songOption = $('#' + song.id);
    var $newli = $( "<li class='swipeout'>test</li>" );

    console.log(song.partyId,"song party id");
    if (song.partyId == currentPartyId){
      if ($songOption.text() === ""){
        // $('ul').append('<li id="' +  song.id + '">' + '<i class="fa fa-thumbs-up" id="upvote"></i>'+ song.title + '  VoteCount: <span>' + song.voteCount + '</span>'+'<i class="fa fa-trash-o" id="delete"></i>'+'</li>');
        $('ul.songs-list').append("\
          <li class='swipeout' data-voteCount=0>\
            <div class='swipeout-content'><a class='item-content item-link'>\
              <div class='item-inner'>\
                <div class='item-title'>\
                  <div class='city' id="+song.id+">"+song.title+"\
                  </div>\
                  <div class='country'>"+song.artist+"\
                  </div>\
                </div>\
                <div class='item-after'><span id='upvoted'>"+song.voteCount+"</span><i class='fa fa-thumbs-up' id='upvote' ></i></div>\
              </div>\
              </a>\
            </div>\
            <div class='swipeout-actions-right'><a href='#'' class='swipeout-delete'>Delete</a></div>\
          </li>\
        ");
      }
      else {
      $songOption.parent().parent().find('#upvoted').text(song.voteCount);
      }
    }
  });

  socket.on('new voted',function(song){
    var $songToIncrement = $('#' + song.id);
    console.log($songToIncrement);
    if ($songToIncrement.text() === ""){
      console.log("inside if statement");
      $('#songs').append("VoteCount: <span>" + song.voteCount + "</span></li>");
    }else{
      $songToIncrement.parent().parent().find('#upvoted').text(song.voteCount);
      $songToIncrement.parent().parent().parent().parent().parent().attr('data-voteCount',song.voteCount);
      setTimeout(function(){
        var $songsSort = $('ul.songs-list');
            $songsSortli = $songsSort.children('li');
        $songsSortli.sort(function(a,b){
          var an = a.getAttribute('data-voteCount');
              bn = b.getAttribute('data-voteCount');
          if(an > bn) {
            return -1;
          }
          if(an < bn) {
            return 1;
          }
          return 0;
        });
        $songsSortli.detach().appendTo($songsSort).fadeIn();
       },1000);
    }
  });

  socket.on('deleted song',function(obj){
    console.log('deleted song');
    $('#' + obj.song).parent().parent().parent().parent().remove();
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
setTimeout(function(){
  var $songsSort = $('ul.songs-list');
      $songsSortli = $songsSort.children('li');
  $songsSortli.sort(function(a,b){
    var an = a.getAttribute('data-voteCount');
        bn = b.getAttribute('data-voteCount');
    if(an > bn) {
      return -1;
    }
    if(an < bn) {
      return 1;
    }
    return 0;
  });
  $songsSortli.detach().appendTo($songsSort).fadeIn();
},300);



