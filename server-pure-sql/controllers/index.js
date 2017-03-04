var models = require('../models');
var app = require('../app');

module.exports = {
  messages: {
    get: function (req, res) {
      //once received call models and pass inquery
      models.messages.get(function(results) {
        res.status(200).json(results).end();
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      //console.log('body', req.body);
      models.messages.post(req.body, function() {
        res.status(201).end();
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(function(results) {
        res.status(200).json(results).end();
      });
    },
    post: function (req, res) {
      //assuming user posts a json with prop 'username'
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