$('#newparty-button').click(function(event){
  event.preventDefault();
  var newName = $('#new-party').val();

  if(newName !== ''){

    $.post('/parties', {partyName: newName}, function(response){
      if (response){
        $('#new-party').val('');
        $('#created-parties').append('<li><a href="/parties/' + response.id + '">' + response.name + '</a><i class="fa fa-archive" id="delete" data="' + response.id + '"></i></li>');
        window.location.href="/parties";

      }
    })
  } else {
    alert('Party name cannot be empty!');
  }
})

$('#delete').on('click',function(){

  $.post('/parties/delete',{partyid: $(this).attr("data")},function(response){
    if (response === "archieved"){
      window.location.href="/parties";
    }
  });
});
