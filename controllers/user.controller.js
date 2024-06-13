'use strict'

var User = require('../models/user.model');
const bcryptjs = require('bcryptjs');



async function createInit(req, res) {
    let user = new User();
    user.password = 'RehMQ3Jq';
    user.email = 'admin@uvg.edu.gt';

    try {
        const userFind = await User.findOne({ email: user.email });

        if (userFind) {
            console.log('No se puede agregar un nuevo usuario administrador');
        } else {
            const saltRounds = 10;
            const passwordHash = await bcryptjs.hash(user.password, saltRounds);

            user.name='ADMIN';
            user.lastname='UVG'
            user.password = passwordHash;
            const userSaved = await user.save();

            if (userSaved) { 
                console.log('Usuario administrador creado');
            } else {
                console.log('Usuario administrador no creado');
            }
        }
    } catch (err) {
        console.log('Error al crear el usuario', err);
    }
} 



module.exports = {
    createInit
}