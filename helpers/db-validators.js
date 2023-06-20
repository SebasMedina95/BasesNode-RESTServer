//Traigo el esquema para evaluar
const Role = require('../models/role')
const {Usuario , Categoria, Producto} = require('../models');
const mongoose = require('mongoose');

//Validamos contra la base de datos,el custom me recibirá el valor a evaluar del body
//Por defecto le ponemos vacío, porque sino podría chocar contra la validación
const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado para uso en la BD Mongo`); //Error personalizado
    }
}

//Validamos de que el email no se encuentre registrado en la base de datos
const emailValido = async( correo = '' ) => {
    //Verificamos si el correo existe, findOne lo buscamos en su objeto
    const existeEmail = await Usuario.findOne({ correo });
    if( existeEmail ){
        throw new Error(`El correo ${correo} ya está registrado en la BD Mongo`); //Error personalizado
    }
}

//Verificamos la existencia del usuario mediante el ID
const existeUsuarioPorId = async( id ) => {
    //Verificamos si el id existe, findById lo buscamos en su objeto por su ID
    // const existeUsuario = await Usuario.findById(id);
    // if( !existeUsuario ){
    //     throw new Error(`El id ${id} no existe en la BD Mongo`); //Error personalizado
    // }
    //Primero validemos que sea un ObjectId valido
    if (mongoose.Types.ObjectId.isValid(id)) {
        //D ser valido lo capturo para validar
        const existId = await Usuario.findById(id);
     if (!existId) {
        throw new Error(`El Usuario con ID ${id} no existe en la BD Mongo`);
        }
    }else{
        throw new Error(`El Usuario con ID ${id} no es válido, no tiene la forma ID Mongo`);
    }
}

const existeCategoriaPorId = async( id ) => {

    if (mongoose.Types.ObjectId.isValid(id)) {
        //D ser valido lo capturo para validar
        const existId = await Categoria.findById(id);
     if (!existId) {
        throw new Error(`La Categoría con ID ${id} no existe en la BD Mongo`);
        }
    }else{
        throw new Error(`La Categoría con ID ${id} no es válido, no tiene la forma ID Mongo`);
    }

}

const existeProductoPorId = async( id ) => {

    if (mongoose.Types.ObjectId.isValid(id)) {
        //D ser valido lo capturo para validar
        const existId = await Producto.findById(id);
     if (!existId) {
        throw new Error(`El Producto con ID ${id} no existe en la BD Mongo`);
        }
    }else{
        throw new Error(`El Producto con ID ${id} no es válido, no tiene la forma ID Mongo`);
    }

}

const coleccionesPermitidas = async( coleccion = '' , colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );

    if( !incluida ){
        throw new Error(`La colección ${coleccion} no es permitida, solo se permiten ${colecciones}`);
    }

    //En las anteriores no hubo necesidad porque, de alguna manera, implícita, ya estabamos mandando el true
    return true;

}

module.exports = {
    esRolValido,
    emailValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}