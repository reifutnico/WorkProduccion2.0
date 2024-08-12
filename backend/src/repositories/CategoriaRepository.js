import {getConnection} from '../BD/database.js'

export default class CategoriaRepository{
    async BuscarCategoriaPorNombre(Nombre){
        const pool = await getConnection()
        const request = await pool.request()
        var query = `select * from Categorias WHERE `
        if (Nombre != null) {
            query +=  `s.Nombre LIKE @Nombre AND `
            request.input('Nombre', sql.VarChar(50), Nombre)
        }
        if (query.endsWith(' AND ')) {
            query = query.slice(0, -5)
        }
        if (query.endsWith(' WHERE ')) {
            query = query.slice(0, -6)
        }
        const {recordset} = await request.query(query);
        return recordset
    }
}