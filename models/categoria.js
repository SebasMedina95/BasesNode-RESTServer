//Sacamos del mongoose lo que necesitamos solamente
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
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
    }
})

CategoriaSchema.methods.toJSON = function() {
    const { __v , estado, ...elResto } = this.toObject(); //Generar la instancia como si fuera un objeto literal de JS
    return elResto;
}

module.exports = model( 'Categoria' , CategoriaSchema );