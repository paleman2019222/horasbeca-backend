'use strict'


var express = require('express');
var api = express.Router();
var userController = require('../controllers/user.controller');
var activityController = require('../controllers/activity.controller')
var mdAuth = require('../middlewares/authenticated');


api.post('/login', userController.login);



//actividades
api.post('/saveActivity/:idU',mdAuth.ensureAuth,mdAuth.ensureAuthAdmin, activityController.addActivity)


module.exports = api;  