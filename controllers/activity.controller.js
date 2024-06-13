'use strict'

var User = require('../models/user.model');
var Activity = require('../models/activity.model.js');
var moment = require('moment');

async function addActivity(req,res){
    var userID = req.params.idU;
    var activity = new Activity();
    if(userID != req.user.sub){
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }
    if (!req.body.name || !req.body.description || !req.body.place || !req.body.date || !req.body.hours) {
        return res.status(400).send({ message: 'Ingresa todos los datos necesarios para crear una actividad' });
    }
    try {
        const userfind = await User.findOne({_id:userID});
        if(userfind){
            activity.name = req.body.name
            activity.description = req.body.description
            activity.place = req.body.place
            activity.date = req.body.date
            activity.status = true
            activity.hours = req.body.hours
            const activitysaved = await activity.save();
            if(activitysaved){
                return res.status(200).send({ message: 'Actividad creada correctamente', activitysaved});
            }
            else{
                return res.status(200).send({ message: 'No se guardo la actividad', activitysaved});
            }
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Error al guardad la actividad' });
    }

}


//PABLO
async function getAllActivities(req, res){
    var userId = req.params.idU;
    if(userId != req.user.sub){
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }

    try {
        const activities = await Activity.find();

        if(activities){
            return res.status(200).send({message:'actividades encontradas', activities});
        }else{
            return res.status(404).send({message:'No hay actividades'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({message:'Error al buscar las actividades', error})
    }

}

//PEDRO


//NATAN


//JUAN



//SAMUEL
module.exports = {
    addActivity,

    //PABLO.
    getAllActivities,

    //PEDRO
    //JUAN
    //NATAN
    //SAMUEL
}