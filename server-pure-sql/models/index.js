var db = require('../db');
var Promise = require('bluebird');

module.exports = {
  messages: {
    get: function (cb) {
      db.connect()
        .then(function(connection) {
          var query = 'select messages.messageId as "objectId", messages.text, rooms.name as "roomname", users.name as "username", messages.createdAt from messages inner join rooms on messages.roomId = rooms.roomId inner join users on messages.userId = users.userId order by createdAt desc';

          db.query(connection, query)
            .then(function(results) {
              //console.log('results', res.results);
              db.disconnect(results.connection)
                .then(function() {
                  // results.results = [{} {} {} {}]
                  var sendBackResult = {};
                  sendBackResult.results = results.results;
                  cb(sendBackResult);
                });
            });
        });
    }, // a function which produces all the messages
    post: function (messageData, cb) {
      var userId;
      var roomId;

      var userQuery = 'select userId from users where name="' + messageData.username + '";';
      var roomQuery = 'select roomId from rooms where name ="' + messageData.roomname + '";';

      var postFullMessage = function(connection, text, roomId, userId) {
        var fullQuery = 'INSERT INTO messages (text, roomId, userId, createdAt) VALUES ("' + text + '", ' + roomId + ', ' + userId + ', now());';
        db.query(connection, fullQuery)
          .then(function(results) {
            db.disconnect(results.connection)
              .then(function () {
                cb();
              });
          });
      };

      var checkAndCreateRoom = function(connection) {
        db.query(connection, roomQuery)
          .then(function(results) {
            // room exists
            if (results.results.length > 0) {
              roomId = results.results[0].roomId;
              postFullMessage(results.connection, messageData.text, roomId, userId);
            } else {
              // room doesn't exist
              var insertRoomQuery = 'INSERT INTO rooms (name) VALUES ("' + messageData.roomname + '");';
              db.query(results.connection, insertRoomQuery)
                .then(function(results) {
                  roomId = results.results.insertId;
                  postFullMessage(results.connection, messageData.text, roomId, userId);
                });
            }
          });
      };

      var checkAndCreateUser = function(connection) {
        db.query(connection, userQuery)
          .then(function(results) {
            // user exists
            if (results.results.length > 0) {
              userId = results.results[0].userId;
              checkAndCreateRoom(results.connection);
            } else {
              // user doesn't exist, insert new user then check for lobby logic
              var insertUserQuery = 'INSERT INTO users (name) VALUES ("' + messageData.username + '");';
              db.query(results.connection, insertUserQuery)
                .then(function(results) {
                  userId = results.results.insertId;
                  checkAndCreateRoom(results.connection);
                });
            }
          });
      };

      db.connect()
        .then(function(connection) {
          checkAndCreateUser(connection);
        });
    } // a function which can be used to insert a message into the database
  },

  users: {
    get: function (cb) {
      db.connect()
        .then(function(connection) {
          var query = 'select name from users';

          db.query(connection, query)
            .then(function(res) {
              db.disconnect(res.connection)
                .then(function() {
                  cb(res.results);
                });
            });
        });
    },
    post: function (data, cb) {
      console.log('username------', data.username);
      var insertUserQuery = 'INSERT INTO users (name) VALUES ("' + data.username + '");';

      db.connect()
        .then(function(connection) {
          db.query(connection, insertUserQuery)
            .then(function(results) {
              db.disconnect(results.connection)
                .then(function () {
                  cb();
                });
            });
        });
    }
  }
};

