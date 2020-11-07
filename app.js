var sql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "pass4root",
    database: "mydb"
});

const express = require("express");
const app = express();
const url = require('url');

