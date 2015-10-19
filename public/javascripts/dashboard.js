$(function() {

  var socket = io();
  var url = "https://embed.spotify.com/?uri=spotify:track:";

  $('td').on('click', function() {
    var spotify_id = $(this).attr('data');
    $(this).addClass('hide');
    $('iframe').attr('src', url + spotify_id);
  });

  socket.on('new song', function(song) {
    var partyId = $('th').attr('data');
    var $songOption = $('')
    if (partyId == song.partyId) {

    }
  });

});