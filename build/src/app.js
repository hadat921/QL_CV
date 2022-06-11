"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var app = (0, _express["default"])();
var hostname = '0.0.0.0';
var port = 8080;
app.get('/', function (req, res) {
  res.send('<h1>Hello World!</h1><hr>');
});
app.listen(port, hostname, function () {
  console.log("Hihihihihi ".concat(hostname, ":").concat(port, "/"));
});