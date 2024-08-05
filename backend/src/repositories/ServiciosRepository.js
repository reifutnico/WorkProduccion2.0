import {getConnection} from '../BD/database.js'
import sql, {  } from "mssql";


export default class ServicioRepository{

    
async BorrarServicio(id, id_creator_user){
    var query = `DELETE FROM Servicios WHERE id = ${id} AND idCreador = ${id_creator_user}`;
    try {
        const pool = await getConnection()
        await pool.request().query(query);
        console.log('Servicio borrado');
    } catch (error) {
        console.error('Error al borrar el servicio', error.stack);
        throw error;
    }
}
async EditarDisponibilidad(disponibilidad){
    var query = `UPDATE Disponibilidad SET `
    if (disponibilidad.HoraDesde != null){
        query += `HoraDesde = '${disponibilidad.HoraDesde}', `
    }
    if (disponibilidad.HoraHasta != null){
        query += `HoraHasta = '${disponibilidad.HoraHasta}', `
    }
    if (disponibilidad.DuracionTurno != null){
        query += `DuracionTurno = '${disponibilidad.DuracionTurno}', `
    }
    if (disponibilidad.Descanso != null){
        query += `Descanso = '${disponibilidad.Descanso}', `
    }
    if (query.endsWith(', ')){
        query = query.slice(0, -2)
    }
    query += ` WHERE id = @Id`
    console.log(query)
    const pool = await getConnection()
    const request = pool.request();
    request.input('Id', sql.Int, disponibilidad.id)
    try {
        await request.query(query);
        console.log('Disponibilidad');
    } catch (error) {
        console.error('Error al actualizar la disponibilidad (Repository', error.stack);
        throw error;
    }
    
}
async EditarServicio(servicio){
    var query = `UPDATE Servicios SET `
    if (servicio.Nombre != null){
        query += `Nombre = @Nombre, `
    }
    if (servicio.Descripcion != null){
        query += `Descripcion = @Descripcion, `
    }
    if (servicio.Foto != null){
        query += `Foto = @Foto, `
    }
    if (servicio.Precio != null){
        query += `Precio = @Precio`
    }
    if (query.endsWith(', ')){
        query = query.slice(0, -1)
    }
    query += ` WHERE id = @Id`
    const pool = await getConnection()
    const request = pool.request();
    request.input('Id', sql.Int, servicio.id)
    request.input('Nombre', sql.VarChar, servicio.Nombre);
    request.input('Descripcion', sql.Text, servicio.Descripcion);
    request.input('Foto', sql.VarBinary, servicio.Foto);
    request.input('Precio', sql.Money, servicio.Precio);
    console.log(query)
    try {
        await request.query(query);
        console.log('Servicio actualizado');
    } catch (error) {
        console.error('Error al actualizar el servicio (Repository', error.stack);
        throw error;
    }
}
async CrearServicio(servicio, disponibilidades){
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();
        const serviceResult = await transaction.request()
            .input('idCreador', sql.Int, servicio.idCreador)
            .input('idCategoria', sql.Int, servicio.idCategoria)
            .input('Nombre', sql.VarChar(50), servicio.Nombre)
            .input('Descripcion', sql.Text, servicio.Descripcion)
            .input('Foto', sql.Image, servicio.Foto)
            .input('Precio', sql.Money, servicio.Precio)
            .query(`
                INSERT INTO Servicios (idCreador, idCategoria, Nombre, Descripcion, Foto, Precio)
                VALUES (@idCreador, @idCategoria, @Nombre, @Descripcion, @Foto, @Precio);
                SELECT SCOPE_IDENTITY() AS idServicio;
            `);

        const idServicio = serviceResult.recordset[0].idServicio;
        for (var disponibilidad of disponibilidades) {
            await transaction.request()
                .input('Dia', sql.SmallInt, disponibilidad.Dia)
                .input('idServicio', sql.Int, idServicio)
                .query(`
                    INSERT INTO Disponibilidad (Dia, HoraDesde, HoraHasta, idServicio, DuracionTurno, Descanso)
                    VALUES (@Dia, '${disponibilidad.HoraDesde}', '${disponibilidad.HoraHasta}', @idServicio,
                     '${disponibilidad.DuracionTurno}', '${disponibilidad.Descanso}');
                `);
        }
        await transaction.commit();
        console.log('Servicio y disponibilidades insertados correctamente.');
    } catch (err) {
        await transaction.rollback();
        console.error('Error al insertar servicio y disponibilidades:', err);
    } finally {
        pool.close();
    }
}
    async CrearServicio2prueba(servicio){
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();
            await transaction.request()
                .input('idCreador', sql.Int, servicio.idCreador)
                .input('idCategoria', sql.Int, servicio.idCategoria)
                .input('Nombre', sql.VarChar(50), servicio.Nombre)
                .input('Descripcion', sql.VarChar(100), servicio.Descripcion)
                .input('Foto', sql.VarChar(100), servicio.Foto)
                .input('Precio', sql.Money, servicio.Precio)
                .query(`
                    INSERT INTO Servicios (idCreador, idCategoria, Nombre, Descripcion, Foto, Precio)
                    VALUES (@idCreador, @idCategoria, @Nombre, @Descripcion, @Foto, @Precio);
                    SELECT SCOPE_IDENTITY() AS idServicio;
                `);
            await transaction.commit();
            console.log('Servicio y disponibilidades insertados correctamente.');
        } catch (err) {
            await transaction.rollback();
            console.error('Error al insertar servicio y disponibilidades:', err);
        } finally {
            pool.close();
        }
}

async BuscarServicioPorNombre(Nombre, CategoriaNombre, UsuarioNombre){
    const pool = await getConnection()
    const request = await pool.request()
    var query = `SELECT s.id, idCreador, idCategoria, s.Nombre, Descripcion, Foto, Precio, c.Nombre, u.Nombre, COUNT(sc.idServicio) AS cantidad_contratos
    FROM
    Servicios s
    LEFT JOIN
    ServiciosContratados sc ON s.id = sc.idServicio
    INNER JOIN Categorias c on s.idCategoria = c.id
    INNER JOIN Usuarios u on s.idCreador = u.id
    GROUP BY
    s.id, s.Nombre, s.idCreador, s.idCategoria, s.Descripcion, s.Foto, s.Precio, c.Nombre, u.Nombre
    ORDER BY
    cantidad_contratos DESC WHERE `
    if (Nombre != null) {
        query +=  `s.Nombre LIKE @Nombre AND `
        request.input('Nombre', sql.VarChar(50), Nombre)
    }
    if (CategoriaNombre != null) {
        query += `c.Nombre = @CategoriaNombre AND `
        request.input('CategoriaNombre', sql.VarChar(50), CategoriaNombre)
    }
    if (UsuarioNombre != null) {
        query += `u.Nombre = @UsuarioNombre `
        request.input('UsuarioNombre', sql.VarChar(50), UsuarioNombre)
    }
    if (query.endsWith(' AND ')) {
        query = query.slice(0, -5)
    }
    if (query.endsWith(' WHERE ')) {
        query = query.slice(0, -6)
    }
    console.log(query)
    const {recordset} = await request.query(query);
    return recordset
}
}