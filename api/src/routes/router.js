/* const { Router } = require('express');
const router = Router(); */
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

const express = require("express");
const router = express.Router();

const { listVideogames, videogameDetails, createVideogame, listGenres, deleteVideogame } = require("./services");

router.get("/videogames", listVideogames);

router.get("/videogame/:idVideogame", videogameDetails);

// Toda la informacion llega por body mediante un formulario:
router.post("/videogames", createVideogame);

router.get("/genres", listGenres);

router.delete("/videogame/delete/:id", deleteVideogame);

// Podría hacer una ruta para usar el filter name y devolver 15 videogames con el nombre que me pase el usuario

// no hacer el searchbar y mandarlo en el home nomas, sin modularizar
// hacer un action que filtre los videogames por nombre con un includes y la palabra del usuario

module.exports = { router };
