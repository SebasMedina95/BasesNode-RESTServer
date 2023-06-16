// Mongo se guarda como objeto
// Se guarda en colecciones
// Las colecciones son como las tablas
// {
//     nombre: '',
//     correo: '',
//     celular: '',
//     password: '',
//     img: '',
//     rol: '',
//     estado: false,
//     google: false
// }

//Sacamos del mongoose lo que necesitamos solamente
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    celular: {
        type: String,
        required: [true, 'El celular es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
        // enum: ['ADMIN_ROLE' , 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Para que no nos quede la respuesta del password ni la versión que arroja el registro en mongo, entonces podemos aplicar un método personalizado
//debemos aplicarlo como un function para este tipo de validación por temas del this
UsuarioSchema.methods.toJSON = function() {
    //Sacamos la versión, el id y el password, y todos los demás
    //los dejo almacenamos en elResto.
    const { __v , _id, password, ...elResto } = this.toObject(); //Generar la instancia como si fuera un objeto literal de JS
    elResto.uid = _id; //Renombramos
    return elResto;
}

//Defino el nombre que tendrá la tabla que será Usuario, en Mongo la colocará en plural 
//de forma automática y defino luego cual será el esquema, en este caso UsuarioSchema
module.exports = model( 'Usuario' , UsuarioSchema );