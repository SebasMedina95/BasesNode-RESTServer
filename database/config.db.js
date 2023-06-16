//Requerimos la conexión
const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CNN_ATLAS );

        console.log('>>> BASE DE DATOS ONLINE <<<');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD Mongo');
    }

}


module.exports = {
    dbConnection
}