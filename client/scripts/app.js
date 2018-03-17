var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  friends: []
}


app.init = function() {
  
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    '*': {'read': true},
    'message': {'read': true, 'write': false},
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
}

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message Received');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  }); 
}

app.clearMessages = function() {
  $('#chats').html('');
}

app.renderMessage = function(message) {
  var $message = $(`<p class=message>${message.username}: ${message.text}</p>`);
  $message.on('click', this.handleUserNameClick());
  $message.appendTo('#chats');
  $('')
  
}

app.renderRoom = function(roomName) {
  $('#roomSelect').append(`<div>${roomName}</div>`);
}

app.handleUserNameClick = function() {
  this.friends.push(message.username);
  console.log('CLICK');
}

app.handleSubmit = function() {

}











































































































































































































































































































