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

    async crearServicio(servicio, disponibilidades) {
        try {
            await servicioRepository.CrearServicio(servicio, disponibilidades);
        } catch (error) {
            throw new Error('Error al crear el servicio');
        }
    }

    
    async crearServicio2(servicio) {
        try {
            await servicioRepository.CrearServicio2prueba(servicio);
        } catch (error) {
            throw new Error('Error al crear el servicio');
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
}