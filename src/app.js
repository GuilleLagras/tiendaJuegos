import express from "express";
import __dirname from './utils.js';
import exphbs from 'express-handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';
import { Server } from "socket.io";
import MongoStore from "connect-mongo";
import productsRouter from "./Routes/products.routes.js";
import cartsRouter from "./Routes/cart.routes.js";
import viewsRouter from "./Routes/views.routes.js";
import messageRouter from "./Routes/message.routes.js";
import sessionsrouter from './Routes/sessions.routes.js';
import session from "express-session";
import mongoose from "mongoose";


// coneccion a db
import "./dao/db/configDB.js"
import { messageManager } from "./dao/db/manager/message.manager.js";
import { productManager } from "./dao/db/manager/products.manager.js";


const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'))

//Session
app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 3600
    }),
    secret: 'Coder5575Secret',
    resave: true, // sirve para poder refrescar o actualizar la sesión luego de un de inactivadad
    saveUninitialized: true, // sirve para desactivar el almacenamiento de la session si el usuario aún no se ha identificado o aún no a iniciado sesión
}));

//handlebars
const hbs = exphbs.create({
    extname: 'handlebars',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

//routes de products , carts , mensaje,session
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/chat', messageRouter);
app.use('/products', productsRouter);
app.use('/api/sessions', sessionsrouter);



// Iniciar el servidor
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
});

app.on('error', (error) => {
    console.log(`Error: ${error}`);
});

const socketServer = new Server(httpServer);
socketServer.on('connection', async (socket) => {
    console.log(`Cliente Conectado: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Cliente Desconectado: ${socket.id}`);
    });
    // agregar product en mongo
    socket.on('addProduct', async (product) => {
        try {
            const createdProduct = await productManager.createOne(product);
            const productosActualizados = await productManager.findAll({limit:100});
            socketServer.emit('actualizarProductos', productosActualizados);
            console.log(createdProduct)
        } catch (error) {
            console.error('Error al agregar el producto:', error.message);
        }
    });

    socket.on('deleteProduct', async (id) => {
        try {

            const result = await productManager.deleteOne({ _id: id });

            if (result.deletedCount > 0) {
                const productosActualizados = await productManager.findAll({limit:100});
                socketServer.emit('actualizarProductos', productosActualizados);
            } else {
                console.error('El producto no se encontró para eliminar.');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error.message);
        }
    });
    // mensajes

    socket.on('addMessage', async (data) => {
        try {
            const { email, message } = data;
            const savedMessage = await messageManager.createOne(email, message);
            const messages = await messageManager.findAll();
            socketServer.emit('actualizarMensajes', messages);
        } catch (error) {
            console.error('Error al agregar el mensaje:', error.message);
        }
    });
});
