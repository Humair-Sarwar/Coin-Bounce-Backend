const dotenv = require("dotenv").config();

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.HOST;
const BASE_URL = process.env.BASE_URL;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REACT_URL = process.env.REACT_URL

module.exports = { 
    PORT,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    HOST,
    BASE_URL,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    REACT_URL
};
