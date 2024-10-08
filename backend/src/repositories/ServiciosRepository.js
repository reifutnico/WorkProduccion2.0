import { getConnection } from '../BD/database.js';
import sql from 'mssql';

export default class ServicioRepository {
    async BorrarServicio(id, id_creator_user) {
        var query = `DELETE FROM Servicios WHERE id = ${id} AND idCreador = ${id_creator_user}`;
        try {
            const pool = await getConnection();
            await pool.request().query(query);
            console.log('Servicio borrado');
        } catch (error) {
            console.error('Error al borrar el servicio', error.stack);
            throw error;
        }
    }

    async EditarDisponibilidad(disponibilidad) {
        var query = `UPDATE Disponibilidad SET `;
        if (disponibilidad.HoraDesde != null) {
            query += `HoraDesde = '${disponibilidad.HoraDesde}', `;
        }
        if (disponibilidad.HoraHasta != null) {
            query += `HoraHasta = '${disponibilidad.HoraHasta}', `;
        }
        if (disponibilidad.DuracionTurno != null) {
            query += `DuracionTurno = '${disponibilidad.DuracionTurno}', `;
        }
        if (disponibilidad.Descanso != null) {
            query += `Descanso = '${disponibilidad.Descanso}', `;
        }
        if (query.endsWith(', ')) {
            query = query.slice(0, -2);
        }
        query += ` WHERE id = @Id`;
        console.log(query);
        const pool = await getConnection();
        const request = pool.request();
        request.input('Id', sql.Int, disponibilidad.id);
        try {
            await request.query(query);
            console.log('Disponibilidad actualizada');
        } catch (error) {
            console.error('Error al actualizar la disponibilidad (Repository)', error.stack);
            throw error;
        }
    }

    async EditarServicio(servicio) {
        var query = `UPDATE Servicios SET `;
        if (servicio.Nombre != null) {
            query += `Nombre = @Nombre, `;
        }
        if (servicio.Descripcion != null) {
            query += `Descripcion = @Descripcion, `;
        }
        if (servicio.Foto != null) {
            query += `Foto = @Foto, `;
        }
        if (servicio.Precio != null) {
            query += `Precio = @Precio `;
        }
        if (query.endsWith(', ')) {
            query = query.slice(0, -2);
        }
        query += ` WHERE id = @Id`;
        const pool = await getConnection();
        const request = pool.request();
        request.input('Id', sql.Int, servicio.id);
        request.input('Nombre', sql.VarChar, servicio.Nombre);
        request.input('Descripcion', sql.Text, servicio.Descripcion);
        request.input('Foto', sql.VarBinary, servicio.Foto);
        request.input('Precio', sql.Money, servicio.Precio);
        console.log(query);
        try {
            await request.query(query);
            console.log('Servicio actualizado');
        } catch (error) {
            console.error('Error al actualizar el servicio (Repository)', error.stack);
            throw error;
        }
    }

    async CrearServicio(servicio) {
        const pool = await getConnection();
        const request = pool.request();
        const serviceResult = await request
            .input('idCreador', sql.Int, servicio.idCreador)
            .input('idCategoria', sql.Int, servicio.idCategoria)
            .input('Nombre', sql.VarChar(50), servicio.Nombre)
            .input('Descripcion', sql.VarChar(100), servicio.Descripcion)
            .input('Foto', sql.VarChar, servicio.Foto)
            .input('Precio', sql.Money, servicio.Precio)
            .query(`
                INSERT INTO Servicios (idCreador, idCategoria, Nombre, Descripcion, Foto, Precio)
                VALUES (@idCreador, @idCategoria, @Nombre, @Descripcion, @Foto, @Precio);
                SELECT SCOPE_IDENTITY() AS idServicio;
            `);
        const idServicio = serviceResult.recordset[0].idServicio;
        console.log('Servicio insertado correctamente.');
        return idServicio;
    }

    async crearDisponibilidades(idServicio, Disponibilidades) {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        console.log("a")
        try {
            await transaction.begin();
            const request = transaction.request();

            //
            // Inserta disponibilidad y obtiene el id de disponibilidad
            const result = await request
                .input('Dia', sql.VarChar(10), Disponibilidades.Dia)
                .input('idServicio', sql.Int, idServicio)
                .query(`
                    INSERT INTO Disponibilidad (Dia, HoraDesde, HoraHasta, idServicio, DuracionTurno, Descanso)
                    VALUES (@Dia, '${Disponibilidades.HoraDesde}', '${Disponibilidades.HoraHasta}', @idServicio,
                     '${Disponibilidades.DuracionTurno}', '${Disponibilidades.Descanso}');
                    SELECT SCOPE_IDENTITY() AS idDisponibilidad;
                `);

            const idDisponibilidad = result.recordset[0].idDisponibilidad;
            const turnos = ServicioRepository.calcularTurnos(Disponibilidades.HoraDesde, Disponibilidades.HoraHasta, Disponibilidades.DuracionTurno, Disponibilidades.Descanso);
            
            // Llama a crearTurnos pasando idDisponibilidad
            await this.crearTurnos(turnos, idDisponibilidad);

            await transaction.commit();
            console.log('Disponibilidad y turnos insertados correctamente.');
            
        } catch (err) {
            await transaction.rollback();
            console.error('Error al insertar disponibilidad y turnos:', err);
        } finally {
            pool.close();
        }
    }

    static calcularTurnos(horaDesde, horaHasta, duracionTurno, descanso) {
        const turnos = [];
        let current = new Date(`1970-01-01T${horaDesde}:00Z`);
        const end = new Date(`1970-01-01T${horaHasta}:00Z`);
        const duracion = parseInt(duracionTurno.split(':')[0], 10) * 60 + parseInt(duracionTurno.split(':')[1], 10); // en minutos
        const tiempoDescanso = parseInt(descanso.split(':')[0], 10) * 60 + parseInt(descanso.split(':')[1], 10); // en minutos

        while (current < end) {
            let finTurno = new Date(current.getTime() + duracion * 60000);
            if (finTurno > end) break;
            turnos.push({
                start: current.toISOString().substr(11, 5),
                end: finTurno.toISOString().substr(11, 5)
            });
            current = new Date(finTurno.getTime() + tiempoDescanso * 60000);
        }

        return turnos;
    }
    async crearTurnos(turnos, idDisponibilidad) {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();
    
            // Utiliza una sola transacción para múltiples inserciones
            for (const turno of turnos) {
                const request = new sql.Request(transaction); // Crear una nueva instancia para cada turno

                await request
                    .input('comienzo', sql.VarChar, turno.start)
                    .input('final', sql.VarChar, turno.end)
                    .input('idDisponibilidad', sql.Int, idDisponibilidad)
                    .query(`
                        INSERT INTO Turnos (comienzo, final, idDisponibilidad)
                        VALUES (@comienzo, @final, @idDisponibilidad);
                    `);
            }
            console.log('a')
            await transaction.commit();
            console.log('Turnos insertados correctamente.');
        } catch (err) {
            await transaction.rollback();
            console.error('Error al insertar turnos:', err);
        } finally {
            pool.close();
        }
    }
    
    async ObtenerTurnos(idDisponibilidad) {
        const pool = await getConnection();
        const request = pool.request();

        try {
            // Consulta para obtener los turnos asociados al idDisponibilidad
            const query = `
                SELECT *
                FROM Turnos
                WHERE idDisponibilidad = @idDisponibilidad
                ORDER BY comienzo;
            `;
            // Ejecutar la consulta
            request.input('idDisponibilidad', sql.Int, idDisponibilidad);
            const result = await request.query(query);

            // Devolver los turnos obtenidos
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener los turnos:', error.stack);
            throw error;
        } finally {
            pool.close();
        }
    }

    
    

    async crearReserva(idTurno, fechaReserva) {
        const pool = await getConnection();
        const request = pool.request();
    
        try {
            const query = `
                INSERT INTO turnosReservados (idTurno, fecha)
                VALUES (@idTurno, @fechaReserva)
            `;
            // Ejecutar la consulta
            request.input('idTurno', sql.Int, idTurno);
            request.input('fechaReserva', sql.Date, fechaReserva);
            await request.query(query);
            return { success: true };
        } catch (error) {
            console.error('Error al crear reserva:', error.stack);
            throw error;
        } finally {
            pool.close();
        }
    }
    
    

    async ObtenerDisponibilidad(idServicio, Dia) {
        const pool = await getConnection();
        const request = pool.request();
        try {
            const query = `
                SELECT id
                FROM Disponibilidad
                WHERE idServicio = @idServicio AND Dia = @Dia
            `;
            request.input('idServicio', sql.Int, idServicio);
            request.input('Dia', sql.VarChar, Dia);
    
            const result = await request.query(query);
    
            // Depurar resultados
            console.log('Resultados de la consulta:', result.recordset);
    
            if (result.recordset.length === 0) {
                console.log('No se encontraron resultados.');
                return []; // Devolver un array vacío en lugar de null
            }
    
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener la disponibilidad:', error.stack);
            throw error;
        } finally {
            pool.close();
        }
    }

    async  obtenerReservas(idTurno, fecha) {
        const pool = await getConnection();
        const request = pool.request();
    
        try {
            // Verifica los valores de entrada
            console.log('ID Turno:', idTurno);
            console.log('Fecha:', fecha);
    
            const query = `
                SELECT * FROM turnosReservados
                WHERE idTurno = @idTurno AND CAST(fecha AS DATE) = @fecha
            `;
            request.input('idTurno', sql.Int, idTurno);
            request.input('fecha', sql.Date, fecha);
    
            console.log('Ejecutando consulta SQL:', query);
    
            const result = await request.query(query);
    
            // Verifica los resultados obtenidos
            console.log('Resultados de la consulta:', result.recordset);
    
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener reservas:', error.stack);
            throw error;
        } finally {
            pool.close();
        }
    }
    
    
    
    
    async BuscarServicioPorNombre(Nombre, CategoriaNombre, UsuarioNombre) {
        const pool = await getConnection();
        const request = pool.request();
        var query = `SELECT s.id, idCreador, idCategoria, s.Nombre, Descripcion, Foto, Precio, c.Nombre AS CategoriaNombre, u.Nombre AS CreadorNombre
        FROM
        Servicios s
        INNER JOIN Categorias c on s.idCategoria = c.id
        INNER JOIN Usuarios u on s.idCreador = u.id
        GROUP BY
        s.id, s.Nombre, s.idCreador, s.idCategoria, s.Descripcion, s.Foto, s.Precio, c.Nombre, u.Nombre
        HAVING `;
        if (Nombre != null) {
            query += `s.Nombre LIKE '${Nombre}%' AND `;
        }
        if (CategoriaNombre != null) {
            query += `c.Nombre LIKE '${CategoriaNombre}%' AND `;
        }
        if (UsuarioNombre != null) {
            query += `u.Nombre LIKE '${UsuarioNombre}%' AND `;
        }
        if (query.endsWith(' AND ')) {
            query = query.slice(0, -5);
        }
        if (query.endsWith(' HAVING ')) {
            query = query.slice(0, -7);
        }
        console.log(query);
        const { recordset } = await request.query(query);
        return recordset;
    }

    
}
