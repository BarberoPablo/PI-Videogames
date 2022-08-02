import { React, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDetails, clearVideogameDetails } from "../actions";
import styles from "./CardDetails.module.css";
/*
[ ] Los campos mostrados en la ruta principal para cada videojuegos (imagen, nombre, y géneros)
[ ] Descripción
[ ] Fecha de lanzamiento
[ ] Rating
[ ] Plataformas
*/

const CardDetails = () => {
  const dispatch = useDispatch();
  const { idVideogame } = useParams(); //es el match.params.id del componente de clase
  const videogame = useSelector((state) => state.videogameDetails);

  useEffect(() => {
    dispatch(getDetails(idVideogame)); //cuando se monta
    return () => {
      dispatch(clearVideogameDetails());
    };
  }, [dispatch, idVideogame]);

  return videogame && videogame.image ? (
    <div className={styles.conteiner}>
      <Link to="/home">
        <button>Go back</button>
      </Link>
      <h2>
        {videogame.name}----------{videogame.rating}
      </h2>
      <img src={videogame.image} alt="videogame" width="400px" height="200px" />
      <p>{videogame.description}</p>
      <h3>Details</h3>
      <h4>{videogame.released}</h4>

      <div>
        {videogame.platforms?.map((platform, index) => {
          let parsedPlatform = platform;
          if (!videogame.createdInDB) {
            parsedPlatform = parsedPlatform.platform.name;
          }
          return (
            <button name={parsedPlatform} key={index}>
              {parsedPlatform}
            </button>
          );
        })}
      </div>

      <div>
        {videogame.genres?.map((genre, index) => {
          let parsedGenre = genre;
          if (videogame.createdInDB) {
            parsedGenre = parsedGenre.name;
          }
          return (
            <button name={parsedGenre} key={index}>
              {parsedGenre}
            </button>
          );
        })}
      </div>
    </div>
  ) : (
    <div className={styles.conteiner}>
      <img
        className={styles.coinImg}
        src="https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif"
        alt="enter image"
      />
      <h1 clasName={styles.title}>Loading...</h1>
    </div>
  );
};

export default CardDetails;
