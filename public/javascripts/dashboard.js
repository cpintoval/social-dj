$(function() {

  var socket = io();
  var url = "https://embed.spotify.com/?uri=spotify:track:";

  $(document).on('click', 'td', function() {
    var spotify_id = $(this).attr('data');
    $(this).addClass('hide');
    $('iframe').attr('src', url + spotify_id);
  });

  socket.on('new songed', function(song) {
    var partyId = $('th').attr('data');
    var $songOption = $('#' + song.id);
    if (partyId == song.partyId) {
      if ($songOption.text() === "") {
        $('tbody').append("\
          <tr>\
            <td id=" + song.id + " data=" + song.spotify_id + ">\
              <div class='row song'>\
                <div class='large-2 columns'>\
                  <div class='votes'>\
                    <p>+<span class='vote-count'>" + song.voteCount + "</span></p>\
                  </div>\
                </div>\
                <div class='large-8 columns'>\
                  <span class='title'>" + song.title + "</span><br>\
                  <span>" + song.artist + "</span><br>\
                  <span>" + song.album + "</span>\
                </div>\
                <div class='large-2 columns'>\
                </div>\
              </div>\
            </td>\
          </tr>\
            ");
      }
      else {
        $songOption.find('.vote-count').text(song.voteCount);
      }
    }
  });

  socket.on('new voted', function(song) {
    var $songToIncrement = $('#' + song.id);
    if ($songToIncrement.text() === "") {

    }
    else {
      $songToIncrement.find('.vote-count').text(song.voteCount);
      setTimeout(function() {
        var $songsTable = $('tbody');
        var $songsArray = $songsTable.children('tr');
        $songsArray.sort(function(a, b) {
          var votesA = a.find('.vote-count').text();
          
        });
      }, 1000);
    }
  });

});