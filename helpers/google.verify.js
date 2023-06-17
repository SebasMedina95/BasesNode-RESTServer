const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Esto es propio de google para hacer la verificación, le enviamos el token google obtenido
async function googleVerify( token = '' ) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  
      // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  
  //console.log(payload);
  //Ahora extraigo lo que realmente necesito para mostrar
  const { iss, name, picture, email } = payload;

  return {

    google: iss,
    nombre: name,
    img: picture,
    correo: email

  }

}

module.exports = {
    googleVerify
}
