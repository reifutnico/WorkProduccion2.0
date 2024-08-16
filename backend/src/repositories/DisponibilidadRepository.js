import {getConnection} from '../BD/database.js'
import sql from 'mssql'

export default class DisponibilidadRepository{
    async obtenerHorarios(id){
        const pool = await getConnection()
        const request = await pool.request()
        var query = `select * from Disponibilidad WHERE idServicio = @id`
        request.input('id', sql.Int, id)
        console.log(query)
        const {recordset} = await request.query(query);
        return recordset
    }
}