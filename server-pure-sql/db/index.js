var mysql = require('mysql');
var Promise = require('bluebird');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

var connect = function () {
  console.log('in connect');
  return new Promise(function (resolve, reject) {
    var connection = mysql.createConnection({
      user: 'admin',
      password: '',
      database: 'chat'
    });

    connection.connect();

    resolve(connection);
  });
};

var query = function (connection, query) {
  return new Promise(function (resolve, reject) {
    connection.query(query, function (error, results, fields) {
      if (error) {
        reject(error);
      }

      var res = {
        'connection': connection,
        'results': results
      };

      resolve(res);
    });
  });
};

var disconnect = function (connection) {
  console.log('disconnected');
  return new Promise(function (resolve, reject) {
    connection.end();

    resolve();
  });
};

module.exports = {
  connect: connect,
  query: query,
  disconnect: disconnect
};