'use strict'


var express = require('express');
var api = express.Router();
var userController = require('../controllers/user.controller');
var activityController = require('../controllers/activity.controller')
var mdAuth = require('../middlewares/authenticated');

//usuario
api.post('/login', userController.login);
api.get('/profile/:idU', mdAuth.ensureAuth, userController.getProfile);



//actividades
api.post('/saveActivity/:idU', mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, activityController.addActivity);
api.get('/getAllActivities/:idU', mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, activityController.getAllActivities);

api.get('/getAllActivitiesU/:idU', mdAuth.ensureAuth, activityController.getAllActivitiesU);

api.put('/assignActivity/:idA/:idAc/:idU', mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, activityController.assignActivity);


//pablo
api.post('/unassignActivity/:idA/:idAc/:idU', mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, activityController.unassignActivity);
api.get('/getAllUsers/:idU', mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, activityController.getAllUsers);


api.get('/getActivityUsers/:idA/:idU', mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, activityController.getActivityUsers);
//JUan 
api.get('/getUserActivities/:idU', mdAuth.ensureAuth, activityController.getUserActivities);

module.exports = api;


// Lu'
api.delete('/deleteActivity/:idA/:idU', mdAuth.ensureAuth, mdAuth.ensureAuthAdmin, activityController.deleteActivity);
api.put('/assignByStudent/:idA/:idU', mdAuth.ensureAuth, activityController.assignByStudent);


//PABLO
api.get('/attendance/:idA', mdAuth.ensureAuth, activityController.markAttendance);
api.get('/activityqr/:idA', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], activityController.getActivityQR);
//ELIAN

//PEDRO


//SAMUEL


