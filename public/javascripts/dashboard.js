$(function() {

  var socket = io();
  var url = "https://embed.spotify.com/?uri=spotify:track:";

  $(document).on('click', 'td', function() {
    var spotify_id = $(this).attr('data');
    $('iframe').attr('src', url + spotify_id);
    $(this).find('div.equalizer').toggleClass('hide');
  });

  socket.on('new songed', function(song) {
    var partyId = $('th').attr('data');
    var $songOption = $('#' + song.id);
    if (partyId == song.partyId) {
      if ($songOption.text() === "") {
        $('tbody').append("\
          <tr data-votes=0>\
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
                  <div class='delete'>\
                  <p><i class='fa fa-trash-o' id='delete'></i></p>\
                  </div>\
                </div>\
              </div>\
            </td>\
          </tr>\
            ");
      }
      else {
        $songOption.find('.vote-count').text(song.voteCount);
        $songOption.parent().attr('data-votes', song.voteCount);
      }
    }
  });

  socket.on('new voted', function(song) {
    var $songToIncrement = $('#' + song.id);
    if ($songToIncrement.text() === "") {

    }
    else {
      $songToIncrement.find('.vote-count').text(song.voteCount);
      $songToIncrement.parent().attr('data-votes', song.voteCount);
      setTimeout(function() {
        var $songsTable = $('tbody');
        var $songsArray = $songsTable.children('tr');
        $songsArray.sort(function(a, b) {
          var votesA = a.getAttribute('data-votes');
          var votesB = b.getAttribute('data-votes');
          if (votesA > votesB) {
            return -1;
          }
          else if (votesA < votesB) {
            return 1;
          }
          else {
            return 0;
          }
        });
        $songsArray.detach().appendTo($songsTable).fadeIn();
      }, 1000);
    }
  });

  $('tbody').on("click","#delete",function(){
      socket.emit('delete song',{
        song: $(this).parent().parent().parent().parent().parent().attr('id'),
        party: $('th').attr('data')
    });
  });

  socket.on('deleted song',function(obj){
    console.log('deleted song');
    $('#' + obj.song).parent().remove();
  });


});