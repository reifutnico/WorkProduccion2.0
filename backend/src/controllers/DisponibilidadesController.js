import express from "express";
import Disponibilidad from "../entities/Disponibilidad.js";
import DisponibilidadService from "../services/DisponibilidadService.js";

const router = express.Router();
const disponibilidadService = new DisponibilidadService();

router.get("/:id", async (req, res) => {
    try {
        const disponibilidad = await disponibilidadService.obtenerHorarios(req.params.id);
        res.status(200).json(disponibilidad);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});
export default router;