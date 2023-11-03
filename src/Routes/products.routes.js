import { Router } from "express";
import { productManager } from "../dao/db/manager/products.manager.js";
import __dirname from "../utils.js";

const productsRouter = Router();

//     ------ Obtener Productos -------
productsRouter.get('/', async (req, res) => {
    try {
        const products = await (req.query);
        res.status(200).json({
            status: 'success',
            payload: products.result,
            totalPages: products.info.pages,
            prevPage: products.info.prev,
            nextPage: products.info.next,
            page: products.info.page,
            hasPrevPage: products.info.hasPrevPage,
            hasNextPage: products.info.hasNextPage,
            prevLink: products.info.prevLink,
            nextLink: products.info.nextLink,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});
// Ruta para obtener un producto por ID
productsRouter.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await productManager.findById(pid);

        if (product) {
            res.status(200).json({ message: 'Producto encontrado', product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto.' });
    }
});


//  --- Agregar Producto ---- 
productsRouter.post('/', async (req, res) => {
    try {
        const createProduct = await productManager.createOne(req.body)
        res.status(200).json({ message: 'Producto agregado correctamente', product: createProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//      ----  Actualizar un producto por id   ----
productsRouter.put('/:pid', async (req, res) => {
    const pid = req.params.pid;

    try {
        const updatedData = req.body;
        const result = await productManager.updatedOne(pid, updatedData);

        if (result.matchedCount > 0) {
            res.status(200).json({ message: 'Producto actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// ---  Eliminar por id    -----
productsRouter.delete('/:pid', async (req, res) => {
    const pid = req.params.pid

    try {
        await productManager.deleteOne(pid);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


export default productsRouter;
