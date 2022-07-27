import { actionTypes } from "../actions";

const initialState = {
  videogames: [],
  genres: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.getVideogames:
      return {
        ...state,
        videogames: action.payload,
      };
    case actionTypes.getGenres:
      console.log("payload: ", action.payload);
      return {
        ...state,
        genres: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
