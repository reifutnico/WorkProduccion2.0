import ServicioRepository from "../repositories/ServiciosRepository.js";
const servicioRepository = new ServicioRepository();
export default class ServicioService {
    async obtenerServicios() {
        try {
            return await servicioRepository.getAllServicios();
        } catch (error) {
            throw new Error('Error al obtener los servicios');
        }
    }

    async borrarServicio(id, id_creator_user) {
        try {
            await servicioRepository.BorrarServicio(id, id_creator_user);
        } catch (error) {
            throw new Error('Error al borrar el servicio');
        }
    }

    async editarServicio(servicio) {
        try {
            await servicioRepository.EditarServicio(servicio);
        } catch (error) {
            throw new Error('Error al actualizar el servicio (Service)');
        }
    }
    async CrearServicio(servicio) {
            return await servicioRepository.CrearServicio(servicio);
    }
    async EditarDisponibilidad(disponibilidad) {
        try {
            await servicioRepository.EditarDisponibilidad(disponibilidad);
        } catch (error) {
            throw new Error('Error al editar la disponibilidad');
        }
    }
    async BuscarServicioPorNombre(Nombre, CategoriaNombre, UsuarioNombre) {
        try {
            return await servicioRepository.BuscarServicioPorNombre(Nombre, CategoriaNombre, UsuarioNombre);
        } catch (error) {
           throw new Error('Error al obtener los servicios');
        }
    }

    async crearDisponibilidades(id, Disponibilidades) {
        try {
            return await servicioRepository.crearDisponibilidades(id, Disponibilidades);
        } catch (error) {
           throw new Error('Error al crear disponibilidades');
        }
    }

    
    async crearTurnos(idDisponibilidad, Turnos) {
        try {
            return await servicioRepository.crearTurnos(idDisponibilidad, Turnos);
        } catch (error) {
           throw new Error('Error al crear disponibilidades');
        }
    }

    async ObtenerDisponibilidad(idServicio,Dia) {
        try {
            return await servicioRepository.ObtenerDisponibilidad(idServicio,Dia);
        } catch (error) {
           throw new Error('Error al crear disponibilidades');
        }
    }

    
    async ObtenerTurnos(idDisponibilidad){
        try {
            return await servicioRepository.ObtenerTurnos(idDisponibilidad);
        } catch (error) {
           throw new Error('Error al crear disponibilidades');
        }
    }

    async crearReserva(idTurno, fechaReserva,idUsuario){
        try {
            return await servicioRepository.crearReserva(idTurno, fechaReserva,idUsuario);
        } catch (error) {
           throw new Error('Error al en el estado');
        }
    }
    
    async obtenerReservas(idTurno, fecha){
        try {
            return await servicioRepository.obtenerReservas(idTurno, fecha);
        } catch (error) {
           throw new Error('Error al en el estado');
        }
    }
    
     
    async obtenerPendientes(idUsuario)
    {
        try {
            return await servicioRepository.obtenerPendientes(idUsuario);
        } catch (error) {
           throw new Error('Error al en el estado');
        }
    }

    async cambiarEstado(idTurnoReservado, estado) {
        if (idTurnoReservado == null || estado == null) {
            throw new Error('idTurnoReservado y estado son obligatorios.');
        }
        try {
            console.log('Cambiando estado:', { idTurnoReservado, estado });
            const resultado = await servicioRepository.cambiarEstado(idTurnoReservado, estado);
            return resultado;
        } catch (error) {
            console.error('Error al cambiar el estado:', error);
            throw new Error(`Error al cambiar el estado del turno reservado: ${error.message}`);
        }
    }
    
    async obtenerInfoTurnoReservado(idTurnoReservado) {
        try {
            return await servicioRepository.obtenerInfoTurnoReservado(idTurnoReservado);
        } catch (error) {
           throw new Error('Error al en el estado');
        }
    }

    async obtenerServiciosContratados(idUsuario) {
        try {
            const query = `
                SELECT s.id, s.Nombre, s.Descripcion, s.Foto, s.Precio
                FROM Servicios s
                JOIN Contratos c ON c.idServicio = s.id
                WHERE c.idUsuario = @idUsuario
            `;
            const result = await pool.request()
                .input('idUsuario', idUsuario)
                .query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error al obtener servicios contratados:', error);
            throw new Error('Error al obtener servicios contratados');
        }
    }
    
}