'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    email: String,
    role: String,
    password: String,
    hours: Number
})

module.exports = mongoose.model('user', userSchema);