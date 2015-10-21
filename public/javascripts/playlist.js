$(function() {
  var $songsTable = $('tbody');
  var $songsArray = $songsTable.children('tr');
  $songsArray.sort(function(a, b) {
    var votesA = a.getAttribute('data-vote');
    var votesB = b.getAttribute('data-vote');
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
});
