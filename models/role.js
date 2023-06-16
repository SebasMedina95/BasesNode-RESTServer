//Sacamos del mongoose lo que necesitamos solamente
const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true , "El rol es obligartorio"]
    }
})

module.exports = model( 'Role' , RoleSchema );