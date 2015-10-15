var newName;

$('#newparty-button').click(function(event){
  event.preventDefault();
  newName = $('#new-party').val();
  
  if(newName !== ''){

    $.post('/parties', {partyName: newName}, function(response){
      console.log(response);
      if (response){
        console.log(response);
        $('#new-party').val('');
        $('#created-parties').append('<li><a href="/parties/' + response.id + '">' + response.name + '</a></li>');

      }
    })
  } else {
    alert('Party name cannot be empty!');
  }
})