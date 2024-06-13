'use strict'


var express = require('express');
var api = express.Router();
var userController = require('../controllers/user.controller');
var activityController = require('../controllers/activity.controller')
var mdAuth = require('../middlewares/authenticated');

//usuario
api.post('/login', userController.login);
api.get('/profile', mdAuth.ensureAuth, userController.getProfile);



//actividades
api.post('/saveActivity/:idU',mdAuth.ensureAuth,mdAuth.ensureAuthAdmin, activityController.addActivity);
api.get('/getAllActivities/:idU', mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, activityController.getAllActivities);
api.put('/assignActivity/:idA/:idAc/:idU',mdAuth.ensureAuth,mdAuth.ensureAuthAdmin,activityController.assignActivity);

module.exports = api;  