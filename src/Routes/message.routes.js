import { Router } from 'express';
import { messageManager } from '../dao/db/manager/message.manager.js';
const messageRouter = Router();

//       Obtener mensajes
messageRouter.get('/', async (req, res) => {
    try {
        const messages = await messageManager.findAll();
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los mensajes.' });
    }
});

//      Obtener  mensaje segun id
messageRouter.get('/:id', async (req, res) => {
    const mID = req.params.id;
    try {
        const message = await messageManager.findById(mID);
        if (message) {
            res.status(200).json({ message });
        } else {
            res.status(404).json({ error: 'Mensaje no encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el mensaje.' });
    }
});

//    CREAR MENSAJE
messageRouter.post('/', async (req, res) => {
    const { email, message } = req.body;
    try {
        const newMessage = await messageManager.createOne(email, message);

        res.status(200).json({ message: 'Nuevo Mensaje', createdMessage: newMessage });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//    Eliminar msj por ID
messageRouter.delete('/:id', async (req, res) => {
    const mID = req.params.id;
    try {
        const result = await messageManager.deleteOne(mID);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Mensaje eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Mensaje no encontrado para eliminar' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default messageRouter;
