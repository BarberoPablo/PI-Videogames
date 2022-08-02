import { actionTypes } from "../actions";

const initialState = {
  immutableVideogames: [],
  videogames: [],
  genres: [],
  videogameDetails: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.getVideogames: {
      // Voy a cambiarle el formato a los genre de los videojuegos creados en DB
      const videogames = action.payload;
      videogames.forEach((videogame) => {
        videogame.genres = videogame.createdInDB ? videogame.genres.map((genre) => genre.name) : videogame.genres;
      });
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
      const videogamesByGenres = allVideogames.filter((videogame) => videogame.genres.includes(action.payload));
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
      const videogames = state.immutableVideogames;
      let videogamesFiltered = videogames.filter((videogame) => {
        return videogame.name.toLowerCase().includes(action.payload.toLowerCase());
      });
      videogamesFiltered = videogamesFiltered.slice(0, 15);
      return {
        ...state,
        videogames: videogamesFiltered,
      };
    }
    case actionTypes.getDetails: {
      return {
        ...state,
        videogameDetails: action.payload,
      };
    }

    case actionTypes.clearVideogameDetails: {
      return {
        ...state,
        videogameDetails: [],
      };
    }

    default:
      return state;
  }
};

export default rootReducer;
