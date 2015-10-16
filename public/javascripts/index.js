var email, password;

$('#login-button').click(function(event){
  event.preventDefault();
  email = $('#email').val();
  password = $('#password').val();

  $.post('/', {email: email, password: password}, function(response){
    if (response === 'done'){
      window.location.href="/parties";
    } else {
      alert(response.message);
      console.log(response.statusCode);
    }
  })
})

$('#signup-button').click(function(event){
  event.preventDefault();
  email = $('#new-email').val();
  password = $('#new-password').val();

  $.post('/signup', {email: email, password: password}, function(response){
    if (response === 'done'){
      window.location.href="/parties";
    } else {
      alert(response.message);
    }
  })
});

$('#partysearch-button').click(function(event){
  event.preventDefault();
  var goToPartyName = $('#party-input').val();

  $.post('/goto', {partyName: goToPartyName}, function(response){

    window.location.href="/parties/" + response.id;
  });
});
