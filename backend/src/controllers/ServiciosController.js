import ServicioService from "../services/ServicioService.js";
import Servicio from "../entities/Servicio.js";
import express from "express";
import Disponibilidad from "../entities/Disponibilidad.js";
import Usuario from "../entities/Usuario.js";
const router = express.Router();
const servicioService = new ServicioService();
import authMiddleware from "../../auth/authMiddleware.js";

router.post("/miembro", authMiddleware, async (req, res) => {
    const idUsuario = req.user.id;
    console.log(idUsuario);
    try {
        const serMienbro = await servicioService.serMiembro(idUsuario);
        res.status(200).json(serMienbro);
    } catch (error) {
        console.error('Error al obtener servicios contratados:', error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/turnoReservado/:turnoReservadoId', authMiddleware, async (req, res) => {
    const idTurnoReservado = parseInt(req.params.turnoReservadoId, 10);
    console.log(`ID del turno reservado: ${idTurnoReservado}`);
    if (isNaN(idTurnoReservado)) {
        return res.status(400).json({ error: 'ID del turno reservado inválido.' });
    }
    try {
        const turnoInfo = await servicioService.obtenerInfoTurnoReservado(idTurnoReservado);
        if (!turnoInfo) {
            return res.status(404).json({ error: 'No se encontró el turno reservado.' });
        }
        res.status(200).json({ data: turnoInfo });
    } catch (error) {
        console.error('Error al obtener la información del turno reservado:', error);
        res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud.' });
    }
});

router.put("/turnoPendiente/:id", authMiddleware, async (req, res) => {
    const idTurnoReservado = parseInt(req.params.id, 10);
    const estado = req.query.estado;

    console.log(`ID del turno reservado: ${idTurnoReservado}`);
    console.log(`Estado: ${estado}`);

    if (isNaN(idTurnoReservado)) {
        return res.status(400).json({ error: 'ID del turno reservado inválido.' });
    }
    if (estado == null) {
        return res.status(400).json({ error: 'Estado es obligatorio.' });
    }
    try {
        const reservas = await servicioService.cambiarEstado(idTurnoReservado, estado);
        res.status(200).json({ data: reservas });
    } catch (error) {
        console.error('Error al cambiar el estado del turno:', error);
        res.status(500).json({ error: error.message });
    }
});


router.get("/turnoPendiente", authMiddleware, async (req, res) => {
    const idUsuario = req.user.id
    try {
        const data = await servicioService.obtenerPendientes(idUsuario);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: error.message });
    }
});

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

router.post("/",authMiddleware, async (req, res) => {
        const  idCreador = req.user.id
        const {idCategoria, Nombre, Descripcion, Foto, Precio } = req.body;
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
        console.log(Disponibilidades)
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
            data: response
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
        console.log('Resultados de Disponibilidad:', disponibilidad);

        if (disponibilidad && disponibilidad.length > 0) {
            const disponibilidadId = disponibilidad[0].id;
            console.log(`ID de Disponibilidad: ${disponibilidadId}`);
            
            const turnos = await servicioService.ObtenerTurnos(disponibilidadId);
            console.log('Turnos obtenidos:', turnos);

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

router.post("/Turnos/:id/reservar", authMiddleware, async (req, res) => {
    const idTurno = req.params.id;
    const fechaReserva = req.body.fechaReserva; 
    const id = req.body.id; 
    const idUsuario = req.user.id;
    try {
        const idCreadorServicio = await servicioService.obtenerIdCreadorServicio(id);
        if (idCreadorServicio === idUsuario) {
            return res.status(400).json({ error: 'No puedes reservar un turno para el servicio que creaste.' });
        }
        const result = await servicioService.crearReserva(idTurno, fechaReserva, idUsuario);
        res.status(200).json({ result });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: error.message });
    }
});
router.get("/TurnosReservados/:id", async (req, res) => {
    const idTurno = req.params.id;
    const fecha = req.query.Fecha;

    console.log('ID Turno recibido:', idTurno);
    console.log('Fecha recibida:', fecha);

    try {
        const reservas = await servicioService.obtenerReservas(idTurno, fecha);
        console.log('Reservas obtenidas:', reservas);

        res.status(200).json({ data: reservas });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: error.message });
    }
});


router.get("/creados", authMiddleware, async (req, res) => {
    const idUsuario = req.user.id;
    try {
        const serviciosCreados = await servicioService.obtenerServiciosCreados(idUsuario);
        res.status(200).json(serviciosCreados);
    } catch (error) {
        console.error('Error al obtener servicios creados:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/contratados", authMiddleware, async (req, res) => {
    const idUsuario = req.user.id;
    try {
        const serviciosContratados = await servicioService.obtenerServiciosContratados(idUsuario);
        res.status(200).json(serviciosContratados);
    } catch (error) {
        console.error('Error al obtener servicios contratados:', error);
        res.status(500).json({ error: error.message });
    }
});




export default router;