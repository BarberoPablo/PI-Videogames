import axios from "axios";

// Declaro mis action types para intentar reducir los problemas de typo:
export const actionTypes = {
  getVideogames: "getVideogames",
  getGenres: "getGenres",
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
