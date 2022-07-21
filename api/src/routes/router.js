/* const { Router } = require('express');
const router = Router(); */
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const express = require("express");
const router = express.Router();

const { listVideogames } = require("./services");

router.get("/videogames", listVideogames);

module.exports = { router };
