import CategoriaRepository from "../repositories/CategoriasRepository.js";
const categoriaRepository = new CategoriaRepository();
export default class CategoriaService {
    async BuscarCategoriaPorNombre(Nombre) {
        try {
            return await categoriaRepository.BuscarCategoriaPorNombre(Nombre);
        } catch (error) {
           throw new Error('Error al obtener los servicios');
        }
    }
}    
