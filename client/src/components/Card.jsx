import React from "react";

// Cada personaje debe contener: imagen, nombre. generos
const Card = ({ name, genres, image }) => {
  return (
    <div>
      <h3>{name}</h3>
      {genres?.map((genre, index) => {
        return <h3 key={index}>{genre}</h3>;
      })}
      <img src={image} alt="videogame" width="200px" height="200px" />
    </div>
  );
};

export default Card;
