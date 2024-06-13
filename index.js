var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT||3400;
const userInit = require('./controllers/user.controller');
require('dotenv').config();

var con = process.env.LOCAL_CONNECTION_KEY;
 
mongoose.Promise = global.Promise;
mongoose.connect(con, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => { 
        console.log('Conectado a BD');
       // userInit.createInit();
        app.listen(port, () => {
            console.log('Servidor corriendo sin problemas', port);
        });
    })
    .catch((err) => { 
        console.error('Error al conectarse a la DB', err);
        process.exit(1);
    });
 
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    }); 
     
