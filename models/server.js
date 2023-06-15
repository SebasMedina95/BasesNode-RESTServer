const express = require('express');
const path = require("path"); //Para no tener problemas con el index
const cors = require('cors'); //Para configurar quien puede acceder a mi api REST

class Server {

    constructor(){
        this.app = express(); //Creamos en el servidor la aplicación de Express
        this.myPort = process.env.PORT;
        this.usuariosRoutePath = '/api/usuarios';

        //Middlewares (Funciones que añaden mas funcionalidades)
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    routes(){
        //Es una especie de Middleware implícito
        this.app.use(this.usuariosRoutePath, require('../routes/usuarios.route'));

    }

    listen(){
        this.app.listen(this.myPort, () => {
            console.log(`La aplicación ejemplo está corriendo por el puerto ${this.myPort}`)
        });
    }

    middlewares(){
        //Use es como la "Palabra reservada" para el uso de los Middlewares

        //Configuración del CORS
        this.app.use( cors() );

        //Lectura y Parseo del Body
        //Para que la información que venga en un post, put ... sea serializada a JSON.
        this.app.use( express.json() );

        //A continuación, el directorio público
        this.app.use( express.static('public') );
    }

}


module.exports = Server;