$(function() {
  var socket = io();

  $('form').submit(function(event) {
    event.preventDefault();
    socket.emit('new song', $('#song').val());
    $('#song').val('');
    return false;
  });

  socket.on('new song', function(song) {
    $('#songs').append($('<li>').text(song));
    console.log(song);
  });

});