$(function() {
  var socket = io();

  $('form').submit(function(event) {
    event.preventDefault();
    socket.emit('new song', $('#song').val());
    $('#song').val('');
    return false;
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
    $('#songs').append($('<li>').text(song));
  });

  function autocomplete(data){
    var $matching_songs = $('#matching-songs');
    $matching_songs.empty();
    var tracks = data.tracks;
    for(var i=0;i<5;i++){
        var track = tracks[i];
        var result = '<option id="' + track.name + '">' + track.name + ' by '+track.artists[0].name +'</option>';
        $matching_songs.append(result);
    }
  }


});

