import express from "express";
import ServiciosController from "./controllers/ServiciosController.js"
import CategoriaController from './controllers/CategoriaController.js'
import DisponiblesController from './controllers/DisponibilidadesController.js'
import AccountController from './controllers/account-controller.js'

import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
const port = 5432;

app.use("/Servicio", ServiciosController);
app.use("/Categoria", CategoriaController);
app.use("/Disponibilidad", DisponiblesController);
app.use("/api/account", AccountController );


app.listen(port, ()  => 
{console.log("Loaded")}
)