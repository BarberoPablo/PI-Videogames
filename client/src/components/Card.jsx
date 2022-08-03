import React from "react";
import { useDispatch } from "react-redux";
import styles from "./Card.module.css";
import { Link } from "react-router-dom";
import { deleteVideogame, getVideogames } from "../actions";

// Cada personaje debe contener: imagen, nombre. generos
const Card = ({ name, genres, image, id, createdInDB }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    const response = window.confirm("Are you sure you want to delete it?");
    if (response) {
      dispatch(deleteVideogame(id));
      dispatch(getVideogames());
      alert("Removed");
      window.location.reload();
    } else {
      alert("The videogame is still ALIVE!");
    }
  };

  return (
    <div className={styles.conteiner}>
      <Link to={`/detail/${id}`}>
        <div className={styles.card}>
          <img className={styles.image} src={image} alt="videogame image" />
          <div className={styles.name}>
            <h3>{name}</h3>
          </div>
          <div className={styles.genres}>
            {genres?.map((genre, index) => (
              <button key={index}>{genre}</button>
            ))}
          </div>
        </div>
      </Link>
      <div className={styles.deleteButton}>
        {createdInDB ? <button onClick={() => handleDelete()}>X</button> : false}
      </div>
    </div>
  );
};

export default Card;
