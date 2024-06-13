'use strict'

var User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
var jwt = require("../services/jwt");


async function createInit(req, res) {
    let user = new User();
    user.password = 'RehMQ3Jq';
    user.email = 'ale22463@uvg.edu.gt';

    try {
        const userFind = await User.findOne({ email: user.email });


   
        if (userFind) {
            console.log('No se puede agregar un nuevo usuario administrador');
        } else {
            const saltRounds = 10;
            const passwordHash = await bcryptjs.hash(user.password, saltRounds);

            user.name='Pablo';
            user.lastname='Alemán',
            user.role= 'ROLE_USER',
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


async function login(req, res) {
    const body = req.body;
    if (body.email && body.password) {
        try {
            const userFind = await User.findOne({ email: body.email});

            if (userFind) {
                const passwordCheck = await bcryptjs.compare(body.password, userFind.password);

                if (passwordCheck) {
                    
                    if (body.gettoken) {
                        console.log('Sesión iniciada');
                        return res.status(200).send({
                            token: jwt.createToken(userFind),
                            user: userFind
                        });


                    }
                } else {
                    return res.status(404).send({ message: "Usuario o contraseña incorrecto(s)" });
                }
            }else{
                return res.status(404).send({ message: "Usuario no encontrado"});
            }
        } catch (err) {
            console.log('Error al buscar usuario', err);
            return res.status(500).send({ message: 'Error al buscar usuario' });
        }
    } else {
        return res.status(500).send({ message: 'Ingrese usuario y contraseña' });
    }
}






module.exports = {
    createInit,
    login
}