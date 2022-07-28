import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Card from "./Card";
import Paginado from "./Paginado";
import { getVideogames } from "../actions";
import { getGenres } from "../actions";
import { filterVideogamesByGenre } from "../actions";
import { filterVideogamesByCreator } from "../actions";
import { orderByName } from "../actions";

const Home = () => {
  // Para poder hacer dispatch de mis actions uso:
  const dispatch = useDispatch();
  // Necesito mi estado videogames y genres de mi reducer, esto se genreshace mediante el store(el store-state)
  // Por que hago esto y no uso con dispatch la action que me trae los videogames?
  const allVideogames = useSelector((state) => state.videogames);
  const allGenres = useSelector((state) => state.genres);
  const [nameFilter, setNameFilter] = useState();
  const [order, setOrder] = useState("");

  //Paginado:
  const [currentPage, setCurrentPage] = useState(1);
  const [videogamesPerPage, setVideogamesPerPage] = useState(15);
  const lastVideogameIndex = currentPage * videogamesPerPage; //el ultimo videogame mostrado de la pagina
  const firstVideogameIndex = lastVideogameIndex - videogamesPerPage; //el primer videogame mostrado de la pagina
  const currentVideogames = allVideogames.slice(firstVideogameIndex, lastVideogameIndex); // 0--slice--14(15)  15--slice--29(30)

  // Cuando ejecuto el paginado, todos los indices de arriba se modifican gracias a que se cambió de página (currentPage)
  const paginado = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //Cuando mi componente se monte, quiero despachar las actions para que mi estado tenga los videogames y genres de la API y DB:
  useEffect(() => {
    dispatch(getVideogames());
    dispatch(getGenres());
  }, []);
  //Todo lo de arriba reemplazaría al mapDispatchToProps y toState de los componentes declase

  const handleOnClick = (e) => {
    e.preventDefault();
    //necesito volver a la pagina 1 porque si estoy en otra y hay pocos juegos creados, no me los va a mostrar porque hay solo 1 pagina
    setCurrentPage(1);
    dispatch(getVideogames());
  };

  const handleFilterByGenre = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(filterVideogamesByGenre(e.target.value));
  };

  const handleFilterByCreator = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(filterVideogamesByCreator(e.target.value));
  };

  const handleOrderByName = (e) => {
    e.preventDefault();
    const value = e.target.value;
    if (value === "A-Z" || value === "Z-A") {
      dispatch(orderByName(value, "name"));
    } else {
      dispatch(orderByName(value, "rating"));
    }
    setCurrentPage(1);
    //tengo que modificar un estado para que se vuelvan a renderizar los videogames, si no, no se renderizan otra vez
    setOrder(`Order ${e.target.value}`);
  };

  return (
    <div>
      <Link to="/videogame"> Post videogame </Link>
      <h1>AGUANTEN LOS JUEGUITOS</h1>
      <input type="text" value={nameFilter} placeholder="Videogame filter..." />
      <button
        onClick={(e) => {
          handleOnClick(e);
        }}
      >
        Reload videogames
      </button>
      <div className="sorts">
        <div className="name-rating">
          <select onChange={(e) => handleOrderByName(e)}>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
            <option value="0-5">0-5</option>
            <option value="5-0">5-0</option>
          </select>
          <select onChange={(e) => handleFilterByGenre(e)}>
            {allGenres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select onChange={(e) => handleFilterByCreator(e)}>
            <option value="api">API games</option>
            <option value="user">User games</option>
          </select>
        </div>
      </div>

      <Paginado
        videogamesPerPage={videogamesPerPage}
        videogamesAmount={allVideogames.length}
        paginado={paginado}
      ></Paginado>

      <div className="videogames_area">
        {currentVideogames?.map((videogame, index) => {
          //Esta funcion hace un parse de los genres de los videogames creados en la DB ya que tienen distinto formato que los de la API
          let parsedGenres = videogame.genres;
          if (videogame.createdInDB) {
            //console.log("before: ", parsedGenres);
            parsedGenres = parsedGenres.map((genre) => genre.name);
            //console.log("after: ", parsedGenres);
          }
          return <Card key={index} name={videogame.name} image={videogame.image} genres={parsedGenres} />;
        })}
      </div>
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
