//Sacamos del mongoose lo que necesitamos solamente
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true , "El nombre es obligartorio"],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId, //Tiene que ser otro objeto de mongo
        ref: 'Usuario', //Esquema al que nos referiremos
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId, //Tiene que ser otro objeto de mongo
        ref: 'Categoria', //Esquema al que nos referiremos
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    }
})

ProductoSchema.methods.toJSON = function() {
    const { __v , estado, ...elResto } = this.toObject(); //Generar la instancia como si fuera un objeto literal de JS
    return elResto;
}

module.exports = model( 'Producto' , ProductoSchema );