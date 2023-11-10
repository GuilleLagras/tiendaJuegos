import { Router } from 'express';
import usersModel from '../dao/db/models/Users.model.js';

const sessionrouter = Router();

sessionrouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(422).send({ status: 'error', message: 'incomplete values' });
        }

        const exists = await usersModel.findOne({ email });

        if (exists) {
            return res.status(400).send({ status: 'error', message: 'user already exists' });
        }

        await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password
        })

        res.status(201).send({ status: 'success', message: 'user registered' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

sessionrouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await usersModel.findOne({ email, password });

        if (!user) {
            return res.status(400).send({ status: 'error', message: 'Credenciales incorrectas' });
        }

        // Verificar si el usuario es administrador
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            user.role = 'admin';
        } else {
            user.role = 'usuario';
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        }

        res.send({ status: 'success', message: 'Inicio de sesión exitoso', role: user.role });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});



// Ruta para el cierre de sesión
sessionrouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
        res.redirect('/');
    });
});
export default sessionrouter;