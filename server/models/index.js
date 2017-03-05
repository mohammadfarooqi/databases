var db = require('../db');
var Sequelize = require('sequelize');

module.exports = {
  messages: {
    get: function (cb) {
      db.connection
        .then(function () {
          console.log('connected...');

          db.messages.findAll({
            include: [{model:db.users}, {model:db.rooms}]
          }).then(function(messages) {
            //console.log('messages', vmessages)es;
            messages = messages.map(function(item) {
              var temp = item.dataValues;

              return {
                objectId: temp.objectId,
                text: temp.text,
                roomname: temp.room.dataValues.roomname,
                username: temp.user.dataValues.username,
                createdAt: temp.createdAt
              };
            });

            //console.log(messages);
            var results = {};
            results.results = messages;
            cb(results);
          });
        });
    }, // a function which produces all the messages
    post: function (messageData, cb) {
      var userId;
      var roomId;

      var postMessage = function() {
        db.messages.create({
          roomId: roomId,
          userId: userId,
          text: messageData.text,
        }).then(function () {
          cb();
        });
      };

      var checkAndAddRoom = function() {
        db.rooms.findAll( {
          where: {
            roomname: messageData.roomname
          }
        }).then(function (result) {
          if (result.length === 0) {
            //no room
            db.rooms.create({
              roomname: messageData.roomname
            }).then(function (result) {
              roomId = result.dataValues.roomId;
              postMessage();
            });
          } else {
            //room exists
            roomId = result[0].dataValues.roomId;
            postMessage();
          }
        });
      };

      var checkAndAddUser = function(results) {
        if (results.length === 0) {
          //add user
          db.users.create({
            username: messageData.username
          }).then(function(result) {
            userId = result.dataValues.userId;
            checkAndAddRoom();
          });

        } else {
          userId = results[0].dataValues.userId;
          //continue to check room
          checkAndAddRoom();
        }
      };

      db.connection
        .then(function () {
          console.log('connected...');
          // //check user
          db.users.findAll({
            where: {
              username: messageData.username
            }
          }).then(function(results) {
            checkAndAddUser(results);
          });
        });
    } // a function which can be used to insert a message into the database
  },

  users: {
    get: function (cb) {
      db.connection
        .then(function () {
          console.log('connected...');

          db.users.findAll()
            .then(function(users) {
              //console.log('all users', users);
              cb(users);
            });
        });
    },
    post: function (data, cb) {
      db.connection
        .then(function () {
          db.users.create({
            username: data.username
          });

          cb();
        });
    }
  }
};

