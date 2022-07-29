import axios from "axios";

// Declaro mis action types para intentar reducir los problemas de typo:
export const actionTypes = {
  getVideogames: "getVideogames",
  getGenres: "getGenres",
  filterByGenre: "filterByGenre",
  filterByCreator: "filterByCreator",
  orderByName: "orderByName",
  filterVideogamesByName: "filterVideogamesByName",
  createVideogame: "createVideogame",
};

// Aca sucede la conección entre el front y el back

export const getVideogames = () => {
  return async function (dispatch) {
    var json = await axios.get(`http://localhost:3001/videogames`);
    return dispatch({
      type: actionTypes.getVideogames,
      payload: json.data,
    });
  };
};

export const getGenres = () => {
  return async function (dispatch) {
    var json = await axios.get(`http://localhost:3001/genres`);
    return dispatch({
      type: actionTypes.getGenres,
      payload: json.data,
    });
  };
};

// La lógica la hago en el reducer o el componente, no acá
// payload puede ser cualquier genre
export const filterVideogamesByGenre = (genre) => {
  return {
    type: actionTypes.filterByGenre,
    payload: genre,
  };
};

export const filterVideogamesByCreator = (creator) => {
  return {
    type: actionTypes.filterByCreator,
    payload: creator,
  };
};

// Recibo un orderType, asc o desc y compareProp es la propiedad la cual voy a comparar, ya sea name o rating
export const orderByName = (orderType, compareProp) => {
  return {
    type: actionTypes.orderByName,
    payload: [orderType, compareProp],
  };
};

export const filterVideogamesByName = (name) => {
  //console.log("action/busco juegos con:", name);
  return {
    type: actionTypes.filterVideogamesByName,
    payload: name,
  };
};

// details es un objeto con todas las propiedades, tiene una prop de tipo Date
/* export const createVideogame = (details) => {
  console.log("ACTION", details);
  return async function (dispatch) {
    const json = await axios.post("http://localhost:3001/videogames", details); //HACER PARSE DEL DATE
    console.log(json);
    return json;
  };
}; */

export function createVideogame(payload) {
  console.log("PAYLOAD DE POSTPOKEMONS", payload);
  return async function (dispatch) {
    try {
      console.log("Before");
      const creado = await axios.post("http://localhost:3001/videogames", payload);
      console.log("After");

      return creado;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  };
}

/*
export const getVideogames = () => {
  return async function (dispatch) {
    var json = await axios.get(`http://localhost:3001/videogames`);
    return dispatch({
      type: actionTypes.getVideogames,
      payload: json.data,
    });
  };
};
*/
