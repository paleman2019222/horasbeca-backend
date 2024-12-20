'use strict'

var User = require('../models/user.model');
var Activity = require('../models/activity.model.js');
const path = require('path');
var moment = require('moment');
const QRCode = require('qrcode');
const fs = require('fs');

const urlCv = "https://www.youtube.com/watch?v=kF-wqxZPGwA";
async function addActivity(req, res) {
    var userID = req.params.idU;
    var activity = new Activity();

    if (userID != req.user.sub) {
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }

    if (!req.body.name || !req.body.description || !req.body.place || !req.body.date || !req.body.hours) {
        return res.status(400).send({ message: 'Ingresa todos los datos necesarios para crear una actividad' });
    }

    try {
        const userfind = await User.findOne({ _id: userID });
        if (userfind) {
            // Asignar datos de la actividad
            activity.name = req.body.name;
            activity.description = req.body.description;
            activity.place = req.body.place;
            activity.date = req.body.date;
            activity.status = true;
            activity.hours = req.body.hours;

            // Generar QR
            const qrFolderPath = path.join(__dirname, '../qr');
            const qrFileName = `qr_${activity._id}.png`;
            const qrFilePath = path.join(qrFolderPath, qrFileName);

            // Crear la carpeta si no existe
            if (!fs.existsSync(qrFolderPath)) {
                fs.mkdirSync(qrFolderPath, { recursive: true });
            }

            // Generar el contenido del QR
            const qrContent = `${req.protocol}://${req.get('host')}/api/attendance/${activity._id}`;

            // Guardar el QR como imagen
            await QRCode.toFile(qrFilePath, qrContent);

            // Asignar el nombre del archivo QR al campo de la actividad
            activity.qr = qrFileName;

            // Guardar la actividad
            const activitysaved = await activity.save();
            if (activitysaved) {
                return res.status(200).send({
                    message: 'Actividad creada correctamente',
                    activitysaved
                });
            } else {
                return res.status(200).send({ message: 'No se guardó la actividad', activitysaved });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al guardar la actividad' });
    }
}


//PABLO
async function getAllActivitiesU(req, res) {
    var userId = req.params.idU;
    if (userId != req.user.sub) {
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }
    try {
        const activities = await Activity.find();

        if (activities) {
            return res.status(200).send({ message: 'actividades encontradas', activities });
        } else {
            return res.status(404).send({ message: 'No hay actividades' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error al buscar las actividades', error })
    }
}

async function markAttendance(req, res) {
    const activityId = req.params.idA;
    const userId = req.user.sub; // ID del usuario autenticado

    try {
        // Buscar la actividad
        const activity = await Activity.findOne({ _id: activityId });
        if (!activity) {
            return res.status(404).send({ message: 'Actividad no encontrada' });
        }

        // Verificar si el usuario está asignado a la actividad
        if (!activity.users.includes(userId)) {
            return res.status(403).send({ message: 'No estás asignado a esta actividad' });
        }

        // Verificar si el usuario ya marcó asistencia
        if (activity.attendance.includes(userId)) {
            return res.status(403).send({ message: 'Ya has marcado asistencia para esta actividad' });
        }

        // Buscar al usuario
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        // Registrar la asistencia
        activity.attendance.push(userId);
        await activity.save();

        // Sumar las horas de la actividad al usuario
        user.hours = (user.hours || 0) + activity.hours; // Sumar las horas existentes más las de la actividad
        await user.save();

        return res.status(200).send({
            message: 'Asistencia registrada con éxito y horas actualizadas',
            activity,
            user
        });
    } catch (error) {
        console.error('Error al marcar asistencia:', error);
        return res.status(500).send({ message: 'Error al marcar asistencia', error });
    }
}



async function getAllActivities(req, res) {
    var userId = req.params.idU;
    if (userId != req.user.sub) {
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }
    try {
        const activities = await Activity.find();

        if (activities) {
            return res.status(200).send({ message: 'actividades encontradas', activities });
        } else {
            return res.status(404).send({ message: 'No hay actividades' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error al buscar las actividades', error })
    }
}

async function unassignActivity(req, res) {
    var activityId = req.params.idAc;
    var adminId = req.params.idA;
    var userId = req.params.idU;

    if (adminId != req.user.sub) {
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }

    try {

        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).send({ message: 'Actividad no encontrada' });
        }


        if (!activity.users.includes(userId)) {
            return res.status(403).send({ message: 'El usuario no está asignado a esta actividad' });
        }


        activity.users.pull(userId);
        await activity.save();


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        user.hours = (user.hours || 0) - activity.hours;
        await user.save();

        return res.status(200).send({ message: 'Usuario desasignado de la actividad y horas actualizadas correctamente', activity, user });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error al desasignar usuario de la actividad', error });
    }
}


async function getAllUsers(req, res) {
    try {
        const users = await User.find({});
        if (!users || users.length === 0) {
            return res.status(404).send({ message: 'No se encontraron usuarios' });
        }
        return res.status(200).send({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener los usuarios', error });
    }
}

async function getActivityUsers(req, res) {
    const activityId = req.params.idA;
    const userId = req.params.idU;

    if (userId != req.user.sub) {
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }

    try {
        const activity = await Activity.findById(activityId).populate('users');
        if (!activity) {
            return res.status(404).send({ message: 'Actividad no encontrada' });
        }
        return res.status(200).send({ users: activity.users });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener los usuarios de la actividad', error });
    }
}

//PEDRO
async function deleteActivity(req, res) {
    var activityId = req.params.idA;
    var adminId = req.params.idU;

    if (adminId != req.user.sub) {
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }

    try {
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).send({ message: 'Actividad no encontrada' });
        }
        if (activity.users.length > 0) {
            return res.status(403).send({ message: 'No se puede eliminar la actividad porque tiene usuarios asignados' });
        }
        const activitie = await Activity.findByIdAndDelete(activityId);
        if (activitie) {
            return res.status(200).send({ message: 'Actividad eliminada correctamente', activity });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al eliminar la actividad', error });
    }
}

async function assignByStudent(req, res) {
    const activityId = req.params.idA; // ID de la actividad
    const userId = req.params.idU;       // ID del usuario autenticado (estudiante)

    try {
        // Buscar la actividad
        const activity = await Activity.findOne({_id: activityId});
        if (!activity) {
            return res.status(404).send({ message: 'Actividad no encontrada' });
        }
        // Buscar el usuario
        const user = await User.findOne({_id: userId});
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        // Verificar si el usuario ya está asignado a la actividad
        if (activity.users.includes(userId)) {
            return res.status(403).send({ message: 'Ya estás asignado a esta actividad' });
        }


        // Asignar el usuario a la actividad
        activity.users.push(userId);
        await activity.save();

        // Sumar las horas de la actividad a las horas del usuario
        //user.hours = (user.hours || 0) + activity.hours;
       // await user.save();

        return res.status(200).send({
            message: 'Te has asignado a la actividad y tus horas han sido actualizadas correctamente',
            activity,
            user
        });
    } catch (error) {
        console.error('Error al asignarse a la actividad:', error);
        return res.status(500).send({ message: 'Error al asignarse a la actividad', error });
    }
}

//NATAN
async function assignActivity(req, res) {
    var activityId = req.params.idAc;
    var adminId = req.params.idA;
    var userId = req.params.idU;

    if (adminId != req.user.sub) {
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }

    try {
        // Buscar la actividad
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).send({ message: 'Actividad no encontrada' });
        }

        // Verificar si el usuario ya está asignado a la actividad
        if (activity.users.includes(userId)) {
            return res.status(403).send({ message: 'El usuario ya está asignado a esta actividad' });
        }

        // Asignar el usuario a la actividad
        activity.users.push(userId);
        await activity.save();

        // Buscar el usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        // Sumar las horas de la actividad a las horas del usuario
        user.hours = (user.hours || 0) + activity.hours;
        await user.save();

        return res.status(200).send({ message: 'Usuario asignado a la actividad y horas actualizadas correctamente', activity, user });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Error al asignar usuario a la actividad', error });
    }
}

//JUAN
async function getUserActivities(req, res) {
    let userId = req.params.idU;
    if (userId != req.user.sub) {
        return res.status(403).send({ message: 'No tienes permiso para realizar esta acción' });
    }

    try {
        const activities = await Activity.find({ users: userId });
        if (!activities.length) {
            return res.status(404).send({ message: 'No se encontraron actividades para este usuario' });
        }
        return res.status(200).send({ activities });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener las actividades del usuario', error });

    }
}


//PABLO
async function getActivityQR(req, res) {
    const activityId = req.params.idA; // ID de la actividad
    const userId = req.user.sub; // ID del usuario autenticado

    try {
        // Verificar si el usuario es administrador
        const user = await User.findOne({ _id: userId });
        if (userId!=req.user.sub) { // Suponiendo que el rol de administrador es 'admin'
            return res.status(403).send({ message: 'No tienes permiso para acceder a este recurso' });
        }

        // Buscar la actividad
        const activity = await Activity.findOne({ _id: activityId });
        if (!activity) {
            return res.status(404).send({ message: 'Actividad no encontrada' });
        }

        // Verificar si el QR está asociado a la actividad
        if (!activity.qr) {
            return res.status(404).send({ message: 'Esta actividad no tiene un código QR asociado' });
        }

        // Obtener la ruta completa del QR
        const qrFilePath = path.join(__dirname, '../qr', activity.qr);

        // Verificar si el archivo existe
        if (!fs.existsSync(qrFilePath)) {
            return res.status(404).send({ message: 'El archivo del código QR no existe' });
        }

        // Enviar el archivo como respuesta
        return res.sendFile(qrFilePath);
    } catch (error) {
        console.error('Error al obtener el QR de la actividad:', error);
        return res.status(500).send({ message: 'Error al obtener el QR de la actividad', error });
    }
}
//ELIAN

//PEDRO


//SAMUEL















//SAMUEL
module.exports = {
    addActivity,

    //PABLO.
    getAllActivities,
    unassignActivity,
    getAllUsers,
    getActivityUsers,
    //PEDRO
    deleteActivity,
    assignByStudent,
    //JUAN
    getUserActivities,
    //NATAN
    assignActivity,

  //PABLO
  getAllActivitiesU,
  markAttendance,
  getActivityQR,
//ELIAN

//PEDRO


//SAMUEL
}