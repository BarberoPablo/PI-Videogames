/* Únicos Endpoints/Flags que pueden utilizar
GET https://api.rawg.io/api/games
GET https://api.rawg.io/api/games?search={game}   https://api.rawg.io/api/games?search=gta&key=1c2e5616d523474c8d03ab478ccd169e
GET https://api.rawg.io/api/genres
GET https://api.rawg.io/api/games/{id} 
*/
const axios = require("axios");
// Me traigo mis models:
const { Genre, Videogame } = require("../db");

// Funcion para traerme la informacion de la API:
const getApiInfo = async () => {
  const apiUrl = "https://api.rawg.io/api/games?key=1c2e5616d523474c8d03ab478ccd169e&page_size=40&page=";
  let toReturn = [];
  const apiUrl2 = await axios.get("https://api.rawg.io/api/games?key=1c2e5616d523474c8d03ab478ccd169e&page_size=100");

  // .results accede a los videogames, accedo a las primeras 3 paginas de videogames:
  await Promise.all([axios.get(apiUrl + 1), axios.get(apiUrl + 2), axios.get(apiUrl + 3)]).then((responses) => {
    toReturn = responses[0].data.results.concat(responses[1].data.results).concat(responses[2].data.results);
  });

  //voy a traerme ciertas caracteristicas de los videogames, no todo:
  return toReturn.map((game) => ({
    id: game.id,
    name: game.name,
    image: game.background_image,
    genres: game.genres?.map((genre) => genre.name),
    rating: game.rating,
  }));
};

// Para poder usar getApiInfo tengo que hacer una funcion anonima, no puedo hacer en el root:
// (quiero solo llamar una vez a la api asi es más rápido aunque no se va a actualizar si se pone algun juego nuevo en la API)
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

//  Los posibles genres estan todos en la API al principio y no puedo crear nuevos desde mi DB cuando los traiga
//  El objetivo de esta función es no repetir código
//  Traemos los genres de la API hacia la base de datos (esto se hace única vez ya que usamos "findOrCreate")
//     y retornamos un array con todos los genres existentes que voy a ir utilizando:
const getGenres = async () => {
  const apiGenres = await axios.get("https://api.rawg.io/api/genres?key=1c2e5616d523474c8d03ab478ccd169e");
  const genres = apiGenres.data.results.map((genre) => {
    Genre.findOrCreate({
      where: { name: genre.name },
    });
    return genre.name;
  });
  return genres;
};

// Para poder usar getApiInfo tengo que hacer una funcion anonima, no puedo hacer en el root:
// (quiero solo llamar una vez a la api asi es más rápido aunque no se va a actualizar si se pone algun juego nuevo en la API)
// no me deja hacer await en root
let genresFromDb = null;
(async () => {
  genresFromDb = await getGenres();
})();

// Voy a unificar estos dos get:
// GET /videogames
// GET /videogames?name="..." donde me llega la información por query (devuelvo los primeros 15 videogames con ese name):
const listVideogames = async (req, res) => {
  try {
    // me traigo los videogames
    const videogames = await getAllVideogames();
    const { name } = req.query;

    //si me pasaron un name por query, entonces voy a devolver los primeros 15 videogames que contengan ese nombre
    if (name) {
      let videogame = await videogames.filter((game) => game.name.toLowerCase().includes(name.toLowerCase()));
      videogame = videogame.slice(0, 15);
      //veo si existe un videogame con ese name:
      videogame[0]
        ? res.status(200).json(videogame)
        : res.status(404).send(`There are no games with "${name}" on its title`);
    } else {
      res.status(200).json(videogames);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// GET detalles del videogame Debe traer solo los datos pedidos en la ruta de detalle de videojuego
// incluir generos asociados

const videogameDetails = async (req, res) => {
  try {
    const { idVideogame } = req.params;
    //Diferencio entre videogames de API y DB porque los de DB tienen genres con otro formato
    if (isNaN(idVideogame)) {
      //es uno de mi DB, ya que yo uso un hash alfanumerico en el id
      const videogameDetails = await Videogame.findOne({
        where: { id: idVideogame },
        include: {
          model: Genre,
          attributes: ["name"], //el id lo trae solo
          through: {
            attributes: [],
          },
        },
      });
      res.status(200).json(videogameDetails);
    } else {
      const detailsRequest = await axios.get(
        `https://api.rawg.io/api/games/${idVideogame}?key=1c2e5616d523474c8d03ab478ccd169e`
      );
      const videogameDetails = {
        name: detailsRequest.data.name,
        description: detailsRequest.data.description,
        image: detailsRequest.data.background_image,
        platforms: detailsRequest.data.parent_platforms,
        genres: detailsRequest.data.genres.map((genre) => genre.name), //Mostrarlos de otra forma
        rating: detailsRequest.data.rating,
        released: detailsRequest.data.released,
      };
      res.status(200).json(videogameDetails);
    }
  } catch (error) {
    res.status(404).send(error.message);
    //res.status(404).send(`There is no videogame with the id "${idVideogame}"`);
  }
};

const createVideogame = async (req, res) => {
  try {
    let { name, description, released, rating, platforms, image, createdInDB, genres } = req.body;
    released = released.replace("-", "/");
    if (!name || !description || !platforms[0] || !genres[0] || !rating || rating < 0 || rating > 5)
      throw new Error("Check data: name, description, rating(0-5), platforms and genres are required");
    // Usando "getGenres" voy a traerme los genres de la API hacia mi DB si es que ya no lo hice antes:
    const dbGenres = await getGenres(); //Sacarlo
    // Creemos el videogame:
    const newVideogame = await Videogame.create({
      name,
      description,
      released,
      rating,
      platforms,
      image,
      createdInDB, //viene por dafault, no se la tengo que pasar en Postman
    });
    // Ya tengo todos los genres en mi DB al usar getGenres() ESTO SE EJECUTO SOLO MAS ARRIBA,
    //  ahora solo falta buscar el genre que me pasan por body y vincularlo con el videogame,
    //  recordemos que "getGenres()" devuelve un array:
    // Busco los genres que me pasaron, en mi DB de genres y los genres válidos los guardo en videogameGenres
    const videogameGenres = await Genre.findAll({
      where: { name: genres },
    });
    // Recorro los genres válidos y se los agrego al newVideogame
    videogameGenres.forEach((genre) => {
      newVideogame.addGenre(genre);
    });
    //newVideogame.addGenre(videogameGenres); //metodo add de sequelize
    //res.status(201).send("Videogame created successfully");

    res.status(201).json(newVideogame);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

const listGenres = async (req, res) => {
  try {
    //const dbGenres = await getGenres();
    res.status(200).json(genresFromDb);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteVideogame = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      //es uno de mi DB, ya que yo uso un hash alfanumerico en el id
      const deleteResponse = await Videogame.destroy({
        where: { id: id },
      });
      //actualizo mi DB:
      getAllVideogames();
      if (deleteResponse) {
        return res.status(200).json("Videogame deleted successfully");
      } else {
        return res.status(404).send("Videogame not found");
      }
    } else {
      return res.status(404).send("Invalid id");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { listVideogames, videogameDetails, createVideogame, listGenres, deleteVideogame };
