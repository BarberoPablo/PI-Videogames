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
      console.log("genres action.payload", action.payload);
      const videogamesByGenres = allVideogames.filter((videogame) => videogame.genres.includes(action.payload));
      //console.log("filtrados:", videogamesByGenres);
      console.log("allVideogames:", allVideogames);
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
      console.log("reducer compareProp", compareProp);
      console.log("reducer compareProp az za 50 05", action.payload[0]);
      let sortedVideogames = [];
      if (sortType === "A-Z" || sortType === "0-5") {
        console.log("entre a ascendente");
        sortedVideogames = state.videogames.sort(function (a, b) {
          //console.log("a.compareProp", a[compareProp]);
          if (a[compareProp] > b[compareProp]) {
            console.log(a[compareProp] > b[compareProp]);
            return 1;
          }
          if (b[compareProp] > a[compareProp]) {
            return -1;
          }
          return 0;
        });
      } else {
        console.log("entre a decendente");
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
      sortedVideogames.map((v) => {
        //console.log(v.name);
        console.log(v.rating);
      });
      return {
        ...state,
        videogames: sortedVideogames,
      };
    }
    /* case actionTypes.orderByName: {
      let sortedVideogames =
        action.payload === "A-Z"
          ? state.videogames.sort(function (a, b) {
              if (a.name > b.name) {
                return 1;
              }
              if (b.name > a.name) {
                return -1;
              }
              return 0;
            })
          : state.videogames.sort(function (a, b) {
              if (a.name > b.name) {
                return -1;
              }

              if (b.name > a.name) {
                return 1;
              }
              return 0;
            });

      return {
        ...state,
        videogames: sortedVideogames,
      };
    } */

    default:
      return state;
  }
};

export default rootReducer;
