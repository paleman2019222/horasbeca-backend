'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activitySchema = Schema({
    name: String,
    description: String,
    place: String,
    date: String,
    status: Boolean,
    hours: Number
})

module.exports = mongoose.model('activity', activitySchema);