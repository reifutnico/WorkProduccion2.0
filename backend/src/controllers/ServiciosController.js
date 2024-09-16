import ServicioService from "../services/ServicioService.js";
import Servicio from "../entities/Servicio.js";
import express from "express";
import Disponibilidad from "../entities/Disponibilidad.js";
import Usuario from "../entities/Usuario.js";
const router = express.Router();
const servicioService = new ServicioService();

router.get("/", async (req, res) => {
    const { Nombre, CategoriaNombre, UsuarioNombre } = req.query;
    try {
        const servicios = await servicioService.BuscarServicioPorNombre(Nombre, CategoriaNombre, UsuarioNombre);
        console.log(Nombre, CategoriaNombre, UsuarioNombre)
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
        const id = await servicioService.CrearServicio(servicio);
        res.status(201).json({ message: 'Servicio creado exitosamente', id });
        return id;
});

router.post("/Disponibilidades/:id", async (req, res) => {
    const Disponibilidades = req.body;
    const idServicio = req.params.id
    try{
        console.log(idServicio)
        await servicioService.crearDisponibilidades(idServicio, Disponibilidades);
        res.status(201).json({ message: 'Disponibilidades creadas exitosamente' });
    } catch (error){
        res.status(500).json({ error: error.message });
    }
});

router.post("/Turnos/:id", async (req, res) => {
    const Turnos = req.body;
    const idDisponibilidad = req.params.id
    try{
        console.log(idDisponibilidad)
        await servicioService.crearTurnos(idDisponibilidad, Turnos);
        res.status(201).json({ message: 'Turnos creadas exitosamente' });
    } catch (error){
        res.status(500).json({ error: error.message });
    }
});

router.get("/Disponibilidad/:id", async (req, res) => {
    const idServicio = req.params.id;
    const Dia = req.query.Dia;

    try {
        const response = await servicioService.ObtenerDisponibilidad(idServicio,Dia);
        res.status(200).json({
            message: 'Obtener Dispo',
            data: response // Aquí se envía el objeto JSON obtenido de la base de datos
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/Turnos/:id", async (req, res) => {
    const idServicio = req.params.id;
    const Dia = req.query.Dia;

    console.log(`ID del Servicio: ${idServicio}`);
    console.log(`Día: ${Dia}`);

    try {
        const disponibilidad = await servicioService.ObtenerDisponibilidad(idServicio, Dia);
        console.log('Resultados de Disponibilidad:', disponibilidad); // Imprimir todo el resultado

        // Verificar si disponibilidad tiene resultados
        if (disponibilidad && disponibilidad.length > 0) {
            const disponibilidadId = disponibilidad[0].id; // Acceder al id del primer resultado
            console.log(`ID de Disponibilidad: ${disponibilidadId}`); // Imprimir la ID
            
            const turnos = await servicioService.ObtenerTurnos(disponibilidadId);
            console.log('Turnos obtenidos:', turnos); // Imprimir los turnos obtenidos

            res.status(200).json({
                message: 'Obtener turnos',
                data: turnos
            });
        } else {
            console.log('No se encontró disponibilidad para el idServicio y Dia dados');
            res.status(404).json({ message: 'No se encontró disponibilidad' });
        }
    } catch (error) {
        console.error('Error al obtener turnos:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/Turnos/:id/reservar", async (req, res) => {
    const idTurno = req.params.id;
    const fechaReserva = req.body.fechaReserva; // Recibe la fecha de reserva del cuerpo de la solicitud

    try {
        const result = await servicioService.crearReserva(idTurno, fechaReserva);
        res.status(200).json({ result });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/TurnosReservados/:id", async (req, res) => {
    const idTurno = req.params.id;
    const fecha = req.query.Fecha; // Obtiene la fecha en formato YYYY-MM-DD

    console.log('ID Turno recibido:', idTurno);
    console.log('Fecha recibida:', fecha);

    try {
        const reservas = await servicioService.obtenerReservas(idTurno, fecha);

        // Verifica los datos obtenidos y enviados
        console.log('Reservas obtenidas:', reservas);

        res.status(200).json({ data: reservas });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: error.message });
    }
});





export default router;