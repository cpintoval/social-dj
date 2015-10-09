$(function(){

  // Client making AJAX call to the API to request parties
  $.get('/parties', appendToList);

  function appendToList(parties) {
    var list = [];
    for(var i in parties) {
      list.push($('<li>', { text: parties[i] }));
    }
    $('.song-list').append(list);
  }
});

