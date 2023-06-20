const express = require('express');
const path = require("path"); //Para no tener problemas con el index
const cors = require('cors'); //Para configurar quien puede acceder a mi api REST
const { dbConnection } = require('../database/config.db');
const fileUpload = require('express-fileupload')

class Server {

    constructor(){
        this.app = express(); //Creamos en el servidor la aplicación de Express
        this.myPort = process.env.PORT;

        //Agrupamos los paths
        this.paths = {
            auth : '/api/auth',
            buscar : '/api/buscar',
            categorias: '/api/categorias',
            productos : '/api/productos',
            subirArchivo : '/api/subirArchivo',
            usuarios : '/api/usuarios',
        }

        // this.usuariosRoutePath = '/api/usuarios';
        // this.authRoutePath = '/api/auth';

        //Conectarnos a la base de datos Mongo
        this.conectarDB();

        //Middlewares (Funciones que añaden mas funcionalidades)
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    routes(){
        
        //Es una especie de Middleware implícito
        this.app.use(this.paths.auth, require('../routes/auth.route'));
        this.app.use(this.paths.buscar, require('../routes/buscar.route'));
        this.app.use(this.paths.categorias, require('../routes/categorias.route'));
        this.app.use(this.paths.productos, require('../routes/productos.route'));
        this.app.use(this.paths.subirArchivo, require('../routes/subidas.route'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios.route'));

    }

    listen(){
        this.app.listen(this.myPort, () => {
            console.log(`La aplicación ejemplo está corriendo por el puerto ${this.myPort}`)
        });
    }

    //Función que se ejecuta antes de llamar al controlador en teoría o de continuar con la lógica
    middlewares(){
        //Use es como la "Palabra reservada" para el uso de los Middlewares

        //Configuración del CORS
        this.app.use( cors() );

        //Lectura y Parseo del Body
        //Para que la información que venga en un post, put ... sea serializada a JSON.
        this.app.use( express.json() );

        //A continuación, el directorio público
        this.app.use( express.static('public') );

        //Para manejar la subida de archivos (FileUpload)
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

}


module.exports = Server;