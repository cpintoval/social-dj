$(function() {

  var socket = io();
  var url = "https://embed.spotify.com/?uri=spotify:track:";

  $('td').on('click', function() {
    var id = $(this).attr('id');
    $(this).addClass('hide');
    $('iframe').attr('src', url + id);
  });

  socket.on('new song', function(song) {
    
  });

});