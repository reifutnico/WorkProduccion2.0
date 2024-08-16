import DisponibilidadRepository from "../repositories/DisponibilidadRepository.js";
const disponibilidadRepository = new DisponibilidadRepository();
export default class DisponibilidadService {
    async obtenerHorarios(id) {
        try {
            return await disponibilidadRepository.obtenerHorarios(id);
        } catch (error) {
           throw new Error('Error al obtener los horarios');
        }
    }
}    
