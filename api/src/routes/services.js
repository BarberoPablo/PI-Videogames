/* Únicos Endpoints/Flags que pueden utilizar
GET https://api.rawg.io/api/games
GET https://api.rawg.io/api/games?search={game}
GET https://api.rawg.io/api/genres
GET https://api.rawg.io/api/games/{id} 
*/
const axios = require("axios");
// Me traigo mis models:
const { Genre, Videogame } = require("../db");

const api = {
  baseUrl: "https://api.rawg.io/",
};
// Funcion para traerme la informacion de la API:
const getApiInfo = async () => {
  const path = "api/games?key=1c2e5616d523474c8d03ab478ccd169e";
  const url = `${api.baseUrl}${path}`;
  const response = await axios.get(url);

  //results son los juegos
  //voy a poner todo en minúscula para evitar futuros problemas
  return response.data.results.map((game) => ({
    name: game.name.toLowerCase(),
    image: game.background_image,
    genres: game.genres.map((genre) => genre.name.toLowerCase()),
  }));
};

// Para poder usar getApiInfo tengo que hacer una funcion anonima, no puedo hacer en el root:
// const videogamesFromApi = await getApiInfo();
// no me deja hacer await en root

let videogamesFromApi = null;

(async () => {
  videogamesFromApi = await getApiInfo();
})();

// Funcion para traerme la informacion de la DB:
const getDbInfo = async () => {
  // quiero incluir el modelo Genre con el atributo: name
  // el through es una comprobacion que pongo siempre
  // me trae Videogame con sus generos
  return await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ["name"], //el id lo trae solo
      through: {
        attributes: [],
      },
    },
  });
};

// Funcion para traerle la informacion de la DB y de la API unificada:

const getAllVideogames = async () => {
  const videogamesFromDatabase = await getDbInfo();
  const unifiedInfo = videogamesFromApi.concat(videogamesFromDatabase);

  return unifiedInfo;
};

// Voy a unificar estos dos get:
// GET /videogames
// GET /videogames?name="..." donde me llega la información por query (devuelvo los primeros 15 videogames con ese name):
const listVideogames = async (req, res) => {
  // me traigo los videogames
  const videogames = await getAllVideogames();
  const { name } = req.query;

  //si me pasaron un name por query, entonces voy a devolver los primeros 15 videogames que contengan ese nombre
  if (name) {
    let videogame = await videogames.filter((game) => game.name.toLowerCase().includes(name.toLowerCase())); //tendré que hacer un await para videogames?
    videogame = videogame.slice(0, 15);
    //veo si existe un videogame con ese name:
    videogame[0]
      ? res.status(200).json(videogame)
      : res.status(404).send(`There are no games with "${name}" on its title`);
  } else {
    res.status(200).json(videogames);
  }
};

module.exports = { listVideogames };
