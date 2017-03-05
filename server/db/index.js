var Sequelize = require('sequelize');
var db = new Sequelize('chat', 'admin', '');

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */

var Users = db.define('users', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: Sequelize.TEXT('medium')
});

var Rooms = db.define('rooms', {
  roomId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roomname: Sequelize.TEXT('medium')
});

var Messages = db.define('messages', {
  objectId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: Sequelize.TEXT('medium'),
  // foreign key = roomId
  roomId: {
    type: Sequelize.INTEGER,
    // references: {
    //   model: 'rooms',
    //   key: 'roomId'
    // }
  },
  // foreign key = userId
  userId: {
    type: Sequelize.INTEGER,
    // references: {
    //   model: 'users',
    //   key: 'userId'
    // }
  }
});


// Messages.hasMany(Users, );
// Messages.hasMany(Rooms, );

// Users.belongsTo(Messages);
// Rooms.belongsTo(Messages);
//Users.sync().then(()=>Messages.sync()).then(()=>
Users.sync()
.then(function() {
  return Rooms.sync();
})
.then(function() {
  return Messages.sync();
})
.then(function() {
  Users.hasMany(Messages, {foreignKey: 'userId'});
  Rooms.hasMany(Messages, {foreignKey: 'roomId'});
  Messages.belongsTo(Users, {foreignKey: 'userId'});
  Messages.belongsTo(Rooms, {foreignKey: 'roomId'});
});

module.exports = {
  connection: db.sync(/*{force: true}*/),
  users: Users,
  rooms: Rooms,
  messages: Messages
};
