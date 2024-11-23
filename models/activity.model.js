'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var activitySchema = Schema({
    name: String,
    description: String,
    place: String,
    date: String,
    status: Boolean,
    hours: Number,
    qr: String, // Campo para el nombre del archivo QR
    users: [{ type: Schema.ObjectId, ref: 'user' }],
    attendance: [{ type: Schema.ObjectId, ref: 'user' }] // Campo para registrar asistencia
});

module.exports = mongoose.model('activity', activitySchema);