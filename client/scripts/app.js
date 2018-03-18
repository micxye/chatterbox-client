$(document).ready(function() {
  app.init();
});

var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  username: 'placeHolder',
  roomname: 'lobby',
  messages: [],
  lastMessageId: 0,
  friends: []

}

app.init = function() {
  app.username = window.location.search.substr(10); //get username
  app.$send = $('#send');
  app.$chats = $('#chats');
  app.$message = $('#message');

  app.$send.on('submit', app.handleSubmit);
  app.fetch(); //fetch previous messages
  //poll for new messages at some interval (auto refresh)

};




app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    // '*': {'read': true},
    // 'message': {'read': true, 'write': false},
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      //clear messages input
      app.$message.val('');
      console.log('Message Sent Successfully', data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('Failed to send message', data);
    }
  });
}







//get all of the messages from the server
// then do all work necessary to whatever work is neccessary to display on DOM
app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    data: {order: '-createdAt'},

    success: function (data) {
      if (!data.results || !data.results.length) {
        return;
      }
      app.messages = data.results;
      var mostRecentMessage = app.messages[app.messages.length]
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message', data);
    }
  });
  //need to iterate over messages to append
  for (var i = 0; i < app.messages.length; i++) {
    app.renderMessage(app.messages[i]);
  }
}


app.clearMessages = function() {
  $('#chats').html('');
}


app.renderMessages = function(messages) {
  //clear old messages
  app.clearMessages()
  //render each individual message can use forEach()
  for (var i = 0; i < messages.length; i++) {
    app.renderMessage(messages[i]);
  }
}


app.renderMessage = function(message) {
  // var escapedMsg = _.escape(message.username + ': ' + message.text);
  // var $message = $(`<div class="username"> ${escapedMsg}</div>`);
  var $message = $(`<div class="username">${message.username}:${message.text}</div>`);

  $message.on('click', function() {
    app.friends.push(message.username);
    app.handleUsernameClick();
  })

  $message.appendTo('#chats');
}

app.renderRoom = function(roomName) {
  $('#roomSelect').append(`<div>${roomName}</div>`);
}

app.handleUsernameClick = function() {
  console.log('success');
}

app.handleSubmit = function(event) {
  var message = {
    username: app.username,
    text: app.$message.val(),
    roomname: app.roomname || 'lobby'
  };
  app.send(message);
  event.preventDefault();
  // app.renderMessage(messageObject);
}
