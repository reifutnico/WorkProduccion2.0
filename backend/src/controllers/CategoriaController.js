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
export default router;