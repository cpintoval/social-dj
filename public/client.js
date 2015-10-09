$(function(){

  // Client making AJAX call to the API to request parties
  $.get('/parties', appendToList);

  function appendToList(parties) {
    var list = [];
    var content, party;
    for(var i in parties) {
      party = parties[i];
      content = '<a href=/parties/' + party + '>' + party + '</a>     ' + '<a href="#" data-party=' + party + '>delete</a>';
      list.push($('<li>', { html: content }));
    }
    $('.party-list').append(list);
  }

  $('.party-list').on('click', 'a[data-party]', function(event) {
    if(!confirm("Are you sure?")){
      return false;
    }

    var target = $(event.currentTarget);

    $.ajax({
      type: 'DELETE',
      url: '/parties/' + target.data('party')
    }).done(function() {
      target.parents('li').remove();
    });

  });

  $('form').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var partyData = form.serialize().toLowerCase();

    $.ajax({
      type: 'POST',
      url: '/parties',
      data: partyData
    }).done(function(partyName) {
      appendToList([partyName]);
      form.trigger('reset');
    });
  });

});

