import ServicioService from "../services/ServicioService.js";
import Servicio from "../entities/Servicio.js";
import express from "express";
import Disponibilidad from "../entities/Disponibilidad.js";
import Usuario from "../entities/Usuario.js";
const router = express.Router();
const servicioService = new ServicioService();

router.get("/", async (req, res) => {
    const { Nombre, CategoriaNombre, UsuarioNombre } = req.body;
    try {
        const servicios = await servicioService.BuscarServicioPorNombre(Nombre, CategoriaNombre, UsuarioNombre);
        res.status(200).json(servicios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});

router.delete("/:id/:id_creator_user", async (req, res) => {
    const { id, id_creator_user } = req.params;
    try {
        await servicioService.borrarServicio(id, id_creator_user);
        res.status(201).json({ message: 'Servicio borrado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { Nombre, Descripcion, Foto, Precio } = req.body;
    try {
        const servicio = new Servicio(id, null, null, Nombre, Descripcion, Foto, Precio);
        await servicioService.editarServicio(servicio);
        res.status(200).json({ message: 'Servicio actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id/Disponibilidad", async (req, res) => {
    const { id } = req.params;
    const { HoraDesde, HoraHasta, DuracionTurno, Descanso} = req.body;
    try {
        const disponibilidad = new Disponibilidad(id, null, HoraDesde, HoraHasta, DuracionTurno, Descanso, null);
        await servicioService.EditarDisponibilidad(disponibilidad);
        res.status(200).json({ message: 'Servicio actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    const { idCreador, idCategoria, Nombre, Descripcion, Foto, Precio } = req.body;
      /*  if (!Array.isArray(Disponibilidades)) {
            return res.status(400).json({ error: "Disponibilidades tiene que ser array de datos" });
        }*/
        const servicio = new Servicio(null, idCreador, idCategoria, Nombre, Descripcion, Foto, Precio);
        //await servicioService.crearServicio(servicio, Disponibilidades);
        await servicioService.crearServicio2(servicio);

        res.status(201).json({ message: 'Servicio creado exitosamente' });
});



export default router;