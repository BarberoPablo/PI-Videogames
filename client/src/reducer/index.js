import { actionTypes } from "../actions";

const initialState = {
  immutableVideogames: [],
  videogames: [],
  genres: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.getVideogames: {
      return {
        ...state,
        videogames: action.payload,
        immutableVideogames: action.payload,
      };
    }

    case actionTypes.getGenres: {
      return {
        ...state,
        genres: action.payload,
      };
    }

    case actionTypes.filterByGenre: {
      const allVideogames = state.immutableVideogames;
      //console.log("genres action.payload", action.payload);
      const videogamesByGenres = allVideogames.filter((videogame) => videogame.genres.includes(action.payload));
      //console.log("filtrados:", videogamesByGenres);
      //console.log("allVideogames:", allVideogames);
      return {
        ...state,
        videogames: videogamesByGenres, //immutableVideogames nunca lo modifico, lo uso como auxiliar
      };
    }

    case actionTypes.filterByCreator: {
      const allVideogames = state.immutableVideogames;
      const createdByUser = action.payload === "user" ? true : undefined; //los de la api no tienen la propiedad createdInDB, por eso el undefined
      const videogamesByCreator = allVideogames.filter((videogame) => videogame.createdInDB === createdByUser);
      return {
        ...state,
        videogames: videogamesByCreator,
      };
    }

    case actionTypes.orderByName: {
      //unifico las comparaciones ascendentes y descendentes por rating o name
      const sortType = action.payload[0];
      const compareProp = action.payload[1];
      let sortedVideogames = [];
      if (sortType === "A-Z" || sortType === "0-5") {
        sortedVideogames = state.videogames.sort(function (a, b) {
          if (a[compareProp] > b[compareProp]) {
            return 1;
          }
          if (b[compareProp] > a[compareProp]) {
            return -1;
          }
          return 0;
        });
      } else {
        sortedVideogames = state.videogames.sort(function (a, b) {
          if (a[compareProp] > b[compareProp]) {
            return -1;
          }

          if (b[compareProp] > a[compareProp]) {
            return 1;
          }
          return 0;
        });
      }
      return {
        ...state,
        videogames: sortedVideogames,
      };
    }

    case actionTypes.filterVideogamesByName: {
      //console.log("reducer/busco juegos con:", action.payload);
      const videogames = state.immutableVideogames;
      let videogamesFiltered = videogames.filter((videogame) => {
        //console.log("nombre del videogame", videogame.name.toLowerCase());
        return videogame.name.toLowerCase().includes(action.payload.toLowerCase());
      });
      //console.log("videojuegos before", videogamesFiltered);
      videogamesFiltered = videogamesFiltered.slice(0, 15);
      //console.log("videojuegos after", videogamesFiltered);
      return {
        ...state,
        videogames: videogamesFiltered,
      };
    }

    default:
      return state;
  }
};

export default rootReducer;
