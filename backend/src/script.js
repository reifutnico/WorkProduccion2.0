import express from "express";
import ServiciosController from "./controllers/ServiciosController.js"
import CategoriaController from './controllers/CategoriaController.js'
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
const port = 5432;

app.use("/Servicio", ServiciosController);
app.use("/Categoria", CategoriaController);

app.listen(port, ()  => 
{console.log("Loaded")}
)