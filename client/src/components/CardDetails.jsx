import { React, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDetails } from "../actions";

/*
[ ] Los campos mostrados en la ruta principal para cada videojuegos (imagen, nombre, y géneros)
[ ] Descripción
[ ] Fecha de lanzamiento
[ ] Rating
[ ] Plataformas
*/

const CardDetails = () => {
  const { idVideogame } = useParams(); //es el match.params.id del componente de clase
  const videogame = useSelector((state) => state.videogameDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDetails(idVideogame));
  }, [dispatch, idVideogame]);

  return (
    <div>
      <h2>
        {videogame.name}----------{videogame.rating}
      </h2>
      <img src={videogame.image} alt="videogame" width="400px" height="200px" />
      <p>{videogame.description}</p>
      <h3>Details</h3>
      <h4>{videogame.released}</h4>
      <div>
        {/* <button>{platform}</button> */}
        {videogame.platforms?.map((platform) => (
          <button>Plataforma</button>
        ))}
      </div>
      <div>
        {/* <button>{genre}</button> */}
        {videogame.genres?.map((genre) => (
          <button>Genre</button>
        ))}
      </div>
    </div>
  );
};

export default CardDetails;
