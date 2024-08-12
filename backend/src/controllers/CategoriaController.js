import CategoriaService from "../services/CategoriaService";

const router = express.Router();
const categoriaService = new CategoriaService();

router.get("/:id", async (req, res) => {
    try {
        const categorias = await categoriaService.BuscarCategoriaPorId(req.params.id);
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});