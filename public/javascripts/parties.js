$('#newparty-button').click(function(event){
  event.preventDefault();
  var newName = $('#new-party').val();

  if(newName !== ''){

    $.post('/parties', {partyName: newName}, function(response){
      if (response){
        $('#new-party').val('');
        $('#created-parties').append('<li><a href="/parties/' + response.id + '">' + response.name + '</a><i class="fa fa-archive" id="archive" data="' + response.id + '"></i></li>');
        window.location.href="/parties";

      }
    })
  } else {
    alert('Party name cannot be empty!');
  }
});

$('#active').on('click', '.archive', function(){

  var $thatParty = $(this).parent().parent();

  $.post('/parties/archive',{partyid: $(this).attr("data")},function(response){

    console.log(response,"/parties/archive response");

    var $newListItem = $thatParty.empty().append('<div class="party-item-archive">\
      <a href="/parties/' + response.id + '">' + response.name + '</a>\
        <i class="fa fa-trash-o remove" data="' + response.id + '"></i>\
      <a href="/parties/playlist/"' + response.id + '>\
        <i class="fa fa-th-list playlist" data=' + response.id + '></i>\
      </a>\
      </div>');

    if (response){
      $thatParty.remove();
      $('.playlistparent').append($newListItem);
    }
  });
});

$('#past-list').on('click', '.remove', function(){

  var $thisParty = $(this).parent();
  $.post('/parties/remove',{partyid: $(this).attr('data')},function(response){
    if (response === "removed"){
      $thisParty.remove();
    }
  });
});

$('.playlistparent').on('click','.playlist',function(){
  console.log($(this).attr('data'));
  $.get('/parties/playlist/'+$(this).attr("data"));
});
