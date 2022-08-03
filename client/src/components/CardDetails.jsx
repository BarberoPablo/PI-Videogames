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

  const parseDescription = (description) => {
    let parsed = "";
    let copiar = true;
    for (let i = 0; i < description.length; i++) {
      if (description.charAt(i) === "<") {
        copiar = false;
      }
      if (copiar) {
        parsed += description.charAt(i);
      }
      if (description.charAt(i) === ">") {
        copiar = true;
      }
    }
    return parsed;
  };

  return videogame && videogame.image ? (
    <div className={styles.conteiner}>
      <Link to="/home">
        <button>Go back</button>
      </Link>
      <div className={styles.title}>
        <h2>{videogame.name}</h2>
        <h4>{videogame.released}</h4>
      </div>
      <div className={styles.title}>
        <h3>{videogame.rating}/5</h3>
      </div>
      <div className={styles.imageAndDescription}>
        <img src={videogame.image} alt="videogame" width="400px" height="200px" />
        <p>{parseDescription(videogame.description)}</p>
      </div>
      {/* <h3>Details</h3> */}

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
    <div className={styles.loadingConteiner}>
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
