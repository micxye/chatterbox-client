var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  friends: []
}


app.init = function() {
  // $('body').on('click', function() {
  //   this.handleUsernameClick();
  //   console.log(this);
  // });
  $('#send').submit(function(event) {
    console.log('submitted');
    var message = $('#message').val();
    app.handleSubmit(message); //expects message in string form
    //clear textbox
    event.preventDefault();
    // var form = document.getElementById('#message').reset();
  })
  // $('.submit').on('click', function(e) {
  //   app.handleSubmit($('#message'));
  //   console.log('clicked');
  // });
  // console.log('run init');
};

app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    // '*': {'read': true},
    // 'message': {'read': true, 'write': false},
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
  $('#chats').empty();
}

app.renderMessage = function(message) {
  var $message = $(`<div class="username">${message.username}: ${message.text}</div>`);
  $message.on('click', function() {
    app.friends.push(message.username);
    app.handleUsernameClick();
  })
  $message.appendTo('#chats');

  // $('#chats').prepend(`<div class="message" onclick="app.handleUserNameClick()"> ${message.username} </div>`)

  //onclick="app.handleUsernameClick()"
}

app.renderRoom = function(roomName) {
  $('#roomSelect').append(`<div>${roomName}</div>`);
}

app.handleUsernameClick = function() {
  console.log('success');
}

app.handleSubmit = function(message) {
  var messageObject = {
    username: 'cameron',
    text: message,
    roomname: 'lobby'
  }
  app.renderMessage(messageObject);



}


$(document).ready(function(){
  app.init();
})
