import CategoriaRepository from "../repositories/CategoriasRepository.js";
const categoriaRepository = new CategoriaRepository();
export default class CategoriaService {
    async BuscarCategoriaPorId(id) {
        try {
            return await categoriaRepository.BuscarCategoriaPorId(id);
        } catch (error) {
           throw new Error('Error al obtener los servicios');
        }
    }
}    
