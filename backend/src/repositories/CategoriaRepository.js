import {getConnection} from '../BD/database.js'

export default class CategoriaRepository{
    async BuscarCategoriaPorId(id){
        const pool = await getConnection()
        const request = await pool.request()
        var query = `select * from Categorias where id = ${id}`
        const {recordset} = await request.query(query);
        return recordset
    }
}