"use strict";

require('dotenv').config();

var express = require('express');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize;

var authRouter = require('./router/auth'); // const sequelize = new Sequelize('test', 'root', 'root', {
//   host: 'localhost',
//   dialect: 'postgres'
// });


var app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
var PORT = process.env.port || 8080;
app.listen(PORT, function () {
  return console.log("server chay tren cong hi:" + PORT);
});