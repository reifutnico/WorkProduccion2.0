import { getConnection } from '../BD/database.js';
import sql from 'mssql';

export default class AccountRepository {
    async getUser(user, password) {
        const pool = await getConnection();
        const request = await pool.request();
        const sqlQuery = 'SELECT * FROM Usuarios WHERE Nombre = @user AND password = @password';
        request.input('user', sql.VarChar(50), user);
        request.input('password', sql.VarChar(50), password);
        
        try {
            const { recordset } = await request.query(sqlQuery);
            return recordset.length > 0 ? recordset[0] : null;
        } catch (error) {
            console.log('Error in getUser:', error);
            throw error;
        }
    }

    async registerUser(username, email, telefono, fechaNacimiento, hashedPassword) {
        const pool = await getConnection();
        const request = await pool.request();
        
        try {
            await this.deletePendingUser(email);
            const sqlQuery = `
                INSERT INTO Usuarios (
                    verificadoPrestador, verificadoContratador, Nombre, password, mail, telefono, fechaNacimiento, miembro
                ) 
                OUTPUT inserted.*
                VALUES (@verificadoPrestador, @verificadoContratador, @Nombre, @password, @mail, @telefono, @fechaNacimiento, @miembro)`;

            request.input('verificadoPrestador', sql.Bit, false);
            request.input('verificadoContratador', sql.Bit, false);
            request.input('Nombre', sql.VarChar(50), username);
            request.input('password', sql.VarChar(255), hashedPassword);
            request.input('mail', sql.VarChar(255), email);
            request.input('telefono', sql.VarChar(50), telefono);
            request.input('fechaNacimiento', sql.Date, fechaNacimiento);
            request.input('miembro', sql.Bit, false);
            
            const result = await request.query(sqlQuery);
            return result.recordset[0];
        } catch (error) {
            console.log('Error in registerUser:', error);
            throw error;
        }
    }

    async registerPendingUser(username, email, telefono, fechaNacimiento, hashedPassword, fotoPerfil) {
        const pool = await getConnection();
        const request = await pool.request();
    
        try {
            const sqlQuery = `
                INSERT INTO pending_users (
                    verificadoPrestador, verificadoContratador, Nombre, password, mail, telefono, fechaNacimiento, miembro, fotoPerfil
                ) 
                OUTPUT inserted.*
                VALUES (@verificadoPrestador, @verificadoContratador, @Nombre, @password, @mail, @telefono, @fechaNacimiento, @miembro, @fotoPerfil)`;

                request.input('verificadoPrestador', sql.Bit, false);
                request.input('verificadoContratador', sql.Bit, false);
                request.input('Nombre', sql.VarChar(50), username);
                request.input('password', sql.VarChar(255), hashedPassword);  // Asegúrate que la longitud sea correcta
                request.input('mail', sql.VarChar(50), email);
                request.input('telefono', sql.VarChar(22), telefono);
                request.input('fechaNacimiento', sql.Date, fechaNacimiento);
                request.input('miembro', sql.Bit, false);
                request.input('fotoPerfil', sql.VarChar, fotoPerfil);  // Usa sql.VarChar sin especificar tamaño
                const result = await request.query(sqlQuery);
            return result.recordset[0];
        } catch (error) {
            console.log('Error in registerPendingUser:', error);
            throw error;
        }
    }
    
    async deletePendingUser(email) {
        const pool = await getConnection();
        const request = await pool.request();
        
        try {
            const sqlQuery = 'DELETE FROM pending_users WHERE mail = @email';
            request.input('email', sql.VarChar(255), email);
            await request.query(sqlQuery);
        } catch (error) {
            console.log('Error in deletePendingUser:', error);
            throw error;
        }
    }

    async getPendingUser(email) {
        const pool = await getConnection();
        const request = await pool.request();
        
        try {
            const sqlQuery = 'SELECT * FROM pending_users WHERE mail = @email';
            request.input('email', sql.VarChar(255), email);
            const { recordset } = await request.query(sqlQuery);
            return recordset.length > 0 ? recordset[0] : null;
        } catch (error) {
            console.log('Error in getPendingUser:', error);
            throw error;
        }
    }

    async getUserByIdToken(id) {
        const pool = await getConnection();
        const request = await pool.request();
        
        try {
            const sqlQuery = 'SELECT * FROM Usuarios WHERE id = @id';
            request.input('id', sql.Int, id);
            const { recordset } = await request.query(sqlQuery);
            return recordset.length > 0 ? recordset[0] : null;
        } catch (error) {
            console.log('Error in getUserByIdTokeb:', error);
            throw error;
        }
    }
}
