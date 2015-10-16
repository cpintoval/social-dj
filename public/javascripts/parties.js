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
})

$('.newparties > li > i').on('click',function(){

  var $thatParty = $(this).parent();

  $.post('/parties/archive',{partyid: $(this).attr("data")},function(response){

    console.log(response);

    var $newListItem = $thatParty.empty().append('<li><a href="/parties/' + response.id + '">' + response.name + '</a><i class="fa fa-trash-o" id="remove" data="' + response.id + '"></i></li>');

    if (response){
      $thatParty.remove();
      $('.oldparties').append($newListItem);
    }
  });
});

$('.oldparties > li > i').on('click',function(){

  var $thisParty = $(this).parent();

  $.post('/parties/remove',{partyid: $(this).attr("data")},function(response){
    if (response === "removed"){
      $thisParty.remove();
    }
  });
});
