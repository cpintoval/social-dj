var email, password;

$('#login-button').click(function(event){
  event.preventDefault();
  email = $('#email').val();
  password = $('#password').val();

  $.post('http://localhost:3000/', {email: email, password: password}, function(response){
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

  $.post('http://localhost:3000/signup', {email: email, password: password}, function(response){
    if (response === 'done'){
      window.location.href="/parties";
    } else {
      alert(response.message);
    }
  })
})
