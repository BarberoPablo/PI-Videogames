/* const { Router } = require('express');
const router = Router(); */
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const express = require("express");
const router = express.Router();

const { listVideogames, videogameDetails, createVideogame, listGenres } = require("./services");

router.get("/videogames", listVideogames);

router.get("/videogame/:idVideogame", videogameDetails);

//Toda la informacion llega por body mediante un formulario:
router.post("/videogames", createVideogame);

router.get("/genres", listGenres);

module.exports = { router };
