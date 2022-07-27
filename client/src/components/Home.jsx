import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getVideogames } from "../actions";
import { getGenres } from "../actions";
import Card from "./Card";

const Home = () => {
  // Para poder hacer dispatch de mis actions uso:
  const dispatch = useDispatch();
  // Necesito mi estado videogames y genres de mi reducer, esto se genreshace mediante el store(el store-state)
  // Por que hago esto y no uso con dispatch la action que me trae los videogames?
  const allVideogames = useSelector((state) => state.videogames);
  const allGenres = useSelector((state) => state.genres);

  //Cuando mi componente se monte, quiero despachar las actions para que mi estado tenga los videogames y genres de la API y DB:
  useEffect(() => {
    dispatch(getVideogames());
    dispatch(getGenres());
  }, []);
  //Todo lo de arriba reemplazaría al mapDispatchToProps y toState de los componentes declase

  const handleOnClick = (e) => {
    e.preventDefault();
    dispatch(getVideogames());
  };

  const genres = () => {
    dispatch(getGenres());
  };
  const numeros = [1, 2, 3, 4, 5];
  return (
    <div>
      <Link to="/videogame"> Post videogame </Link>
      <h1>AGUANTEN LOS JUEGUITOS</h1>
      <button
        onClick={(e) => {
          handleOnClick(e);
        }}
      >
        Reload videogames
      </button>
      <div className="Filters">
        <select className="names">
          <option value="Ascendant">Ascendant</option>
          <option value="Descendant">Descendant</option>
        </select>
        <select className="genres">
          {allGenres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
      </div>
      {allVideogames?.map((videogame, index) => {
        //Esta funcion hace un parse de los genres de los videogames creados en la DB ya que tienen distinto formato que los de la API
        let parsedGenres = videogame.genres;
        if (videogame.createdInDB) {
          console.log("before: ", parsedGenres);
          parsedGenres = parsedGenres.map((genre) => genre.name);
          console.log("after: ", parsedGenres);
        }
        return <Card key={index} name={videogame.name} image={videogame.image} genres={parsedGenres} />;
      })}
      {/* {allGenres.map((genre) => (
            <div>{genre}</div>
          ))} */}
    </div>
  );
};

export default Home;
/*
        <select className="genres">
          {console.log("VACIO?: ", genres())}
          {genres()?.map((genre) => (
            <option value={genre.name}>asd</option>
          ))}
        </select>
        {allVideogames?.map((videogame, index) => {
          //Esta funcion hace un parse de los genres de los videogames creados en la DB ya que tienen distinto formato que los de la API
          let parsedGenres = videogame.genres;
          if (videogame.createdInDB) {
            //console.log("parsedGenres before:", parsedGenres);
            parsedGenres = parsedGenres.map((genre) => genre.name);
            //console.log("parsedGenres after:", parsedGenres);
          }
          return <Card key={index} name={videogame.name} image={videogame.image} genres={parsedGenres} />;
        })}
*/
