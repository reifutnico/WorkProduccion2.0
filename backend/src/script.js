import express from "express";
import ServiciosController from "./controllers/ServiciosController.js"
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
const port = 5432;

app.use("/Servicio", ServiciosController);

app.listen(port, ()  => 
{console.log("Loaded")}
)