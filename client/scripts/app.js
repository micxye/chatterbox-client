$(document).ready(function() {
  app.init();
});

var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  username: 'placeHolder',
  roomname: 'lobby',
  messages: [],
  lastMessageId: 0,
  friends: {}

}

app.init = function() {
  app.username = window.location.search.substr(10); //get username
  app.$send = $('#send');
  app.$chats = $('#chats');
  app.$message = $('#message');
  app.$roomSelect = $('#roomSelect');

  app.$send.on('submit', app.handleSubmit);
  app.fetch(false); //fetch previous messages

  //event listeners
  app.$chats.on('click', '.username', app.handleUsernameClick);
  app.$send.on('submit', app.handleSubmit);
  app.$roomSelect.on('change', app.handleRoomChange);

  //poll for new messages at some interval (auto refresh)
  setInterval(function() {
    app.fetch(true);
  }, 2986);
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
      app.fetch();
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
      var mostRecentMessage = app.messages[app.messages.length - 1];

      if (mostRecentMessage.objectId !== app.lastMessageId) {
        //update with fetched rooms
        app.renderRoomList(data.results);
        //update with fetched messages
        app.renderMessages(data.results, animate);
        //store most recent message ID
        app.lastMessageId = mostRecentMessage.objectId;
      }
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
  if (Array.isArray(messages)) {
    messages.filter(function(message) {
      return message.roomname === app.roomname || app.roomname === 'lobby' && !message.roomname;
    }).forEach(app.renderMessage);
  }
  //scroll to top
  if (animate) {
    $('body').animate({scrollTop: '0px'}, 'fast');
  }
}

app.renderRoomList = function(messages) {
  app.$roomSelect.html('<option value="__newRoom">New room...</option>');

  if (messages) {
    var rooms = {};
    messages.forEach(function(message) {
      var roomname = message.roomname;
      if (roomname && !rooms[roomname]) {
        //add the room to the select menu
        app.renderRoom(roomname);
        //store that we've added the room already
        rooms[roomname] = true;
      }
    })
  }
  app.$roomSelect.val(app.roomname);
}

app.renderRoom = function(roomname) {
  //prevent XSS
  var $option = $('<option/>').val(roomname).text(roomname);
  //add to select
  app.$roomSelect.append($option);

}


app.renderMessage = function(message) {
  if (!message.roomname) {
    message.roomname = 'lobby';
  }
  var $message = $(`<div class="chat username">${message.username}:${message.text}</div>`);


  if (app.friends[message.username] === true) {
    $username.addClass('friend');
  }

  $message.appendTo('#chats');
}


app.handleUsernameClick = function() {
  var username = $(event.target).data('username');
  if (username !== undefined) {
    //toggle friend
    app.friends[username] = !app.friends[username];

    //escape username in case it contains quote
    var selector = '[data-username="]' + username.replace(/"/g, '\\\"') + '"]';

    var $usernames = $(selector).toggleClass('friend');
  }
}

app.handleRoomChange = function(event) {

    var selectIndex = app.$roomSelect.prop('selectedIndex');
    // New room is always the first option
    if (selectIndex === 0) {
      var roomname = prompt('Enter room name');
      if (roomname) {
        // Set as the current room
        app.roomname = roomname;

        // Add the room to the menu
        app.renderRoom(roomname);

        // Select the menu option
        app.$roomSelect.val(roomname);
      }
    } else {
      app.startSpinner();
      // Store as undefined for empty names
      app.roomname = app.$roomSelect.val();
    }
    // Rerender messages
    app.renderMessages(app.messages);
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
