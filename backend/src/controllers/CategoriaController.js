import CategoriaService from "../services/CategoriaService";

const router = express.Router();
const categoriaService = new CategoriaService();

router.get("/", async (req, res) => {
    try {
        const { Nombre } = req.body
        const categorias = await categoriaService.BuscarCategoriaPorNombre(Nombre);
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});