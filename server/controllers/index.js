var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(function (result) {
        res.status(200).json(result).end();
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req.body, function() {
        res.status(201).end();
      });
    } // a function which handles posting a message to the database
  },

  users: {
    get: function (req, res) {
      models.users.get(function (users) {
        res.status(200).json(users).end();
      });
    },
    post: function (req, res) {
      models.users.post(req.body, function() {
        res.status(201).end();
      });
    }
  }
};




/*

  -- invoked during app
  messages:
    get -> /messages -> return all messages
    [{text, username, roomname}...]
    post -> /messages -> insert message into messages
      {text, username, roomname} - insert into db

  -- invoked once at the beginning of the app
  users:
    get -> /users -> return all users
    post -> /users -> insert 1 user into users

*/