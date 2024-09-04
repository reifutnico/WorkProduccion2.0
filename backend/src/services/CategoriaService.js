import CategoriaRepository from "../repositories/CategoriaRepository.js";
const categoriaRepository = new CategoriaRepository();
export default class CategoriaService {
    async BuscarCategoriaPorNombre(Nombre) {
        try {
            return await categoriaRepository.BuscarCategoriaPorNombre(Nombre);
        } catch (error) {
           throw new Error('Error al obtener los servicios');
        }
    }

    
    async CategoriasMadre() {
        try {
            return await categoriaRepository.CategoriasMadre();
        } catch (error) {
           throw new Error('Error al obtener las categoriasMadres');
        }
    }

    async Categorias(id) {
        try {
            return await categoriaRepository.Categorias(id);
        } catch (error) {
           throw new Error('Error al obtener las categorias');
        }
    }

    
}    
