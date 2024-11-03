import 'dotenv/config'

export const config = {  
    user: process.env.BD_USERNAME,
    password: process.env.BD_PASSWORD, 
    server: process.env.BD_SERVER, // Nombre del servidor SQL Server
    database: process.env.BD_DATABASE, // Nombre de la base de datos
    options: {
        encrypt: true,
        trustServerCertificate: true 
    },
};
// https://www.youtube.com/watch?v=HMKVnwlhJO0
