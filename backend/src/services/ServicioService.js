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
        try {
            return await servicioRepository.CrearServicio(servicio);
        } catch (error) {
            throw new Error('Error al crear servicio');
        }
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

    async crearReserva(idTurno, fechaReserva){
        try {
            return await servicioRepository.crearReserva(idTurno, fechaReserva);
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
    

}