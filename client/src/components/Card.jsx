import React from "react";
import { useDispatch } from "react-redux";
import styles from "./Card.module.css";
import { Link, useHistory } from "react-router-dom";
import { deleteVideogame, getVideogames } from "../actions";

// Cada personaje debe contener: imagen, nombre. generos
const Card = ({ name, genres, image, id, createdInDB, setOrder }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = () => {
    dispatch(deleteVideogame(id));
    dispatch(getVideogames());
    history.push("/home");
  };

  return (
    <div>
      {createdInDB ? <button onClick={() => handleDelete()}>Delete</button> : false}
      <Link to={`/detail/${id}`}>
        <div className={styles.card}>
          <img className={styles.image} src={image} alt="videogame image" />
          <div className={styles.name}>
            <h3>{name}</h3>
          </div>
          <div>
            {genres?.map((genre, index) => (
              <button className={styles.genres} key={index}>
                {genre}
              </button>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
