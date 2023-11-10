import { Router } from "express";
import { productManager } from "../dao/db/manager/products.manager.js";
import { messageManager } from "../dao/db/manager/message.manager.js";
import __dirname from '../utils.js';
import { cartsManager } from "../dao/db/manager/carts.manager.js";

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    try {
        const limit = 12;

        const { result } = await productManager.findAll({
            limit: limit,
        });

        const productObject = result.map(doc => doc.toObject());
        res.render('home', {
            productList: productObject,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar la vista.' });
    }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const limit = 100;

        const { result } = await productManager.findAll({
            limit: limit,
        });
        const productObject = result.map(doc => doc.toObject());
        res.render('realTimeProducts', {
            productList: productObject,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar la vista.' });
    }
});


viewsRouter.get('/chat', async (req, res) => {
    try {
        const messages = await messageManager.findAll();
        res.render('chat', { messages });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar la vista de chat.' });
    }
});

viewsRouter.get('/api/products', async (req, res) => {
    try {
        const { info, result } = await productManager.findAll(req.query);

        const productObject = result.map(doc => doc.toObject());
        res.render('products', {
            productList: productObject,
            pagination: {
                prevLink: info.prevLink,
                nextLink: info.nextLink,
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar la vista.' });
    }
});


viewsRouter.get('/api/product/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productManager.findById(pid);

        res.render('productView', { product });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar los detalles del producto.' });
    }
});

viewsRouter.get('/api/cart/:cid', async (req, res) => {
    try {
        const idCart = req.params.cid;
        const { cart, total } = await cartsManager.findCartById(idCart);
        res.render('cart', { cart, total });
    } catch (error) {

        res.status(500).send('Error al renderizar la página de carrito');
    }
});

//Inicio/Registro de session

const publicAccess = (req, res, next) => {
    if (req.session?.user) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session?.user) return res.redirect('/login');
    next();
}

viewsRouter.get('/register', publicAccess, (req, res) => {
    res.render('register')
});

viewsRouter.get('/login', publicAccess, (req, res) => {
    res.render('login')
});

viewsRouter.get('/profile', privateAccess, (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
});


export default viewsRouter;