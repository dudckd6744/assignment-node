const Sequelize = require('sequelize');
const User = require('./user');
const Board = require('./board');
const Like = require("./like");

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.Board = Board;
db.User = User;
db.Like = Like;

Board.init(sequelize);
User.init(sequelize);
Like.init(sequelize);

User.associate(db);
Board.associate(db);

module.exports = db; 