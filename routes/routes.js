'use strict'


var express = require('express');
var api = express.Router();
var userController = require('../controllers/user.controller');


api.post('/login', userController.login);



module.exports = api;  