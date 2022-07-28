import axios from "axios";

// Declaro mis action types para intentar reducir los problemas de typo:
export const actionTypes = {
  getVideogames: "getVideogames",
  getGenres: "getGenres",
  filterByGenre: "filterByGenre",
  filterByCreator: "filterByCreator",
  orderByName: "orderByName",
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

export const getVideogamesNames = () => {
  return async function (dispatch) {
    var json = await axios.get(`http://localhost:3001/genres`);
    return dispatch({
      type: actionTypes.getGenres,
      payload: json.data,
    });
  };
};
