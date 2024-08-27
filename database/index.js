const { Sequelize } = require('sequelize');
const { DB_NAME, DB_USERNAME, DB_PASSWORD, HOST } = require('../config');
const userSchema = require('../models/user');
const blogSchema = require('../models/blog');
const commentSchema = require('../models/comment');
const tokenSchema = require('../models/token');

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: HOST,
    dialect: 'postgres'
  });
let UserModel = [];
let BlogModel = [];
let CommentModel = [];
let TokenModel = [];
const dbConnection = async ()=>{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        UserModel.push(await userSchema(sequelize));
        BlogModel.push(await blogSchema(sequelize));
        CommentModel.push(await commentSchema(sequelize));
        TokenModel.push(await tokenSchema(sequelize));
        await sequelize.sync();
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = {
    dbConnection,
    UserModel,
    BlogModel,
    CommentModel,
    TokenModel
}