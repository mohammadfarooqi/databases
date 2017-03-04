-- DROP DATABASE IF EXISTS 'chat';

-- CREATE DATABASE chat;

USE chat;

DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
  messageId INTEGER NOT NULL AUTO_INCREMENT,
  text MEDIUMTEXT NOT NULL,
  roomId INTEGER NULL DEFAULT NULL,
  userId INTEGER NULL DEFAULT NULL,
  createdAt DATETIME NOT NULL,
  PRIMARY KEY (messageId)
);

-- Table 'Users'
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  userId INTEGER NOT NULL AUTO_INCREMENT,
  name MEDIUMTEXT NOT NULL,
  PRIMARY KEY (userId)
);

-- Table 'Rooms'
DROP TABLE IF EXISTS rooms;

CREATE TABLE rooms (
  roomId INTEGER NOT NULL AUTO_INCREMENT,
  name MEDIUMTEXT NOT NULL,
  PRIMARY KEY (roomId)
);

-- Foreign Keys
ALTER TABLE messages ADD FOREIGN KEY (roomId) REFERENCES rooms (roomId);
ALTER TABLE messages ADD FOREIGN KEY (userId) REFERENCES users (userId);


-- ---
-- Test Data
-- ---

INSERT INTO users (name) VALUES ('mohammad');
INSERT INTO users (name) VALUES ('jason');
INSERT INTO rooms (name) VALUES ('lobby');
INSERT INTO rooms (name) VALUES ('lounge');
INSERT INTO messages (text, roomId, userId, createdAt) VALUES ('hey jason',1,1, now());
INSERT INTO messages (text, roomId, userId, createdAt) VALUES ('jason..???',1,1, now());
INSERT INTO messages (text, roomId, userId, createdAt) VALUES ('hey mohammad',1,2, now());
INSERT INTO messages (text, roomId, userId, createdAt) VALUES ('hey there!',2,2, now());







/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/

