import {getConnection} from '../BD/database.js'
import sql from 'mssql'

export default class CategoriaRepository{
    async BuscarCategoriaPorNombre(Nombre){
        const pool = await getConnection()
        const request = await pool.request()
        var query = `select * from Categorias WHERE `
        if (Nombre != null) {
            query +=  `Categorias.Nombre LIKE @Nombre AND `
            request.input('Nombre', sql.VarChar(50), Nombre)
        }
        if (query.endsWith(' AND ')) {
            query = query.slice(0, -5)
        }
        if (query.endsWith(' WHERE ')) {
            query = query.slice(0, -6)
        }
        console.log(query)
        console.log(Nombre)
        const {recordset} = await request.query(query);
        return recordset
    }

    async CategoriasMadre(){
        const pool = await getConnection()
        const request = await pool.request()
        var query = `select * from CategoriaMadre`
        const {recordset} = await request.query(query);
        return recordset
    }

    async Categorias(id){
        const pool = await getConnection()
        const request = await pool.request()
        var query = `select * from Categorias where idCategoriaMadre = @id`
        request.input('id', sql.Int, id)
        const {recordset} = await request.query(query);
        return recordset
    }
    
}