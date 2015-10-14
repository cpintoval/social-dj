$(function() {
  var socket = io();
  var options = [];

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
    var $songOption = $('#' + song.id);
    console.log($songOption.text() === "");
    if ($songOption.text() === ""){
      $('#songs').append('<li id="' +  song.id + '">' + song.title + ' - Votes: <span>' + song.votes + '</span></li>');
    }
    else {
      $songOption.find('span').text(song.votes);
    }
    // $('#songs').append($('<li>').text(song.title + ' - Votes: ' + song.votes).attr('id', song.id));
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

