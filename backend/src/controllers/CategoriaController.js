import CategoriaService from "../services/CategoriaService.js";
import express from "express";

const router = express.Router();
const categoriaService = new CategoriaService();

router.get("/", async (req, res) => {
    try {
        const categorias = await categoriaService.BuscarCategoriaPorNombre(req.query.Nombre);
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/categoriasMadre", async (req, res) => {
    try {
        const categoriasM = await categoriaService.CategoriasMadre();
        console.log('CategoriasMadre:', categoriasM);
        res.status(200).json(categoriasM);
    } catch (error) {
        console.error('Error al obtener las categoriasMadre:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const {id} = req.params.id;
    try {
        const categorias = await categoriaService.Categorias(id);
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;