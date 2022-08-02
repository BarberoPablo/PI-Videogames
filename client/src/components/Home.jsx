import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, History } from "react-router-dom";
import Card from "./Card";
import Paginado from "./Paginado";
import { getVideogames, getGenres, filterVideogamesByGenre, filterVideogamesByCreator } from "../actions";
import { orderByName, filterVideogamesByName, deleteVideogame } from "../actions";
import styles from "./Home.module.css";

const Home = () => {
  // Para poder hacer dispatch de mis actions uso:
  const dispatch = useDispatch();
  // Necesito mi estado videogames y genres de mi reducer, esto se genreshace mediante el store(el store-state)
  // Por que hago esto y no uso con dispatch la action que me trae los videogames?
  const allVideogames = useSelector((state) => state.videogames);
  const allGenres = useSelector((state) => state.genres);
  const [nameFilter, setNameFilter] = useState("");
  const [order, setOrder] = useState("");

  // Paginado:
  // La idea es renderizar currentVideogames, cuando clickeo en el paginado, seteo las variables
  //  firstVideogameIndex y lastVideogameIndex las cuales le cambian el valor a currentVideogames
  //  esto me permite renerizar los videojuegos que siguen. Lo que quiero hacer es que los primeros 3 videogames
  //  tengan un formato diferente, por lo tanto me los separo del resto, si no hay tres, renderizo todos en "videogames" (ver .css)
  const [currentPage, setCurrentPage] = useState(1);
  const [videogamesPerPage, setVideogamesPerPage] = useState(15);
  const lastVideogameIndex = currentPage * videogamesPerPage; //el ultimo videogame mostrado de la pagina
  const firstVideogameIndex = lastVideogameIndex - videogamesPerPage; //el primer videogame mostrado de la pagina
  const currentVideogames = allVideogames.slice(firstVideogameIndex, lastVideogameIndex); // 0--slice--14(15)  15--slice--29(30)

  const [topVideogames, setTopVideogames] = useState();
  const [moreVideogames, setMoreVideogames] = useState();

  // Cuando ejecuto el paginado, todos los indices de arriba se modifican gracias a que se cambió de página (currentPage)
  const paginado = (pageNumber) => {
    setCurrentPage(pageNumber);
    console.log("El paginado se ejecutó con la page:", pageNumber);
  };

  //Cuando mi componente se monte, quiero despachar las actions para que mi estado tenga los videogames y genres de la API y DB:
  useEffect(() => {
    dispatch(getVideogames());
    dispatch(getGenres());
  }, [dispatch]);

  // El motivo de este useEffect es que quiero actualizar mis topVideogames cada vez que se cambia el paginado
  useEffect(() => {
    if (allVideogames.length >= 3) {
      setTopVideogames({
        mainVideogame: currentVideogames[0],
        sideVideogame1: currentVideogames[1],
        sideVideogame2: currentVideogames[2],
      });
      // Quiero sacar los primeros tres videogames asi no los renderizo en "videogames" (ver .css)
      setMoreVideogames(currentVideogames.slice(3, 15));

      console.log("topVideogames:", topVideogames);
      console.log("moreVideogames:", moreVideogames);
    }
  }, [allVideogames, currentPage]);
  //Todo lo de arriba reemplazaría al mapDispatchToProps y toState de los componentes declase

  const handleReloadVideogames = (e) => {
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

  const handleSearchGame = () => {
    if (nameFilter !== "") {
      setCurrentPage(1);
      dispatch(filterVideogamesByName(nameFilter));
      setNameFilter("");
    }
  };

  return (
    <div className={styles.parent}>
      <div className={styles.navBar}>
        <h1 className={styles.title}>AGUANTEN LOS JUEGUITOS</h1>
        <Link to="/create">
          <img
            className={styles.postVideogame}
            src="https://thumbs.gfycat.com/PowerfulOldfashionedConure.webp"
            alt="post image"
          />
          Post a videogame
        </Link>
        <div>
          <span
            className={styles.reload}
            onClick={(e) => {
              handleReloadVideogames(e);
            }}
          >
            &#x21bb;
          </span>

          <input
            type="text"
            value={nameFilter}
            placeholder="Videogame filter..."
            onChange={(e) => setNameFilter(e.target.value)}
          />

          <button onClick={() => handleSearchGame()}>Search Game</button>
        </div>

        <div>
          <select className="name-rating" onChange={(e) => handleOrderByName(e)}>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
            <option value="0-5">0-5</option>
            <option value="5-0">5-0</option>
          </select>
          <select className="genres" onChange={(e) => handleFilterByGenre(e)}>
            {allGenres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <select className="api-user" onChange={(e) => handleFilterByCreator(e)}>
            <option value="api">API games</option>
            <option value="user">User games</option>
          </select>
        </div>
        <div>
          <Paginado
            videogamesPerPage={videogamesPerPage}
            videogamesAmount={allVideogames.length}
            paginado={paginado}
          ></Paginado>
        </div>
      </div>

      <div className={styles.mainVideogame}>
        {/* Tengo que esperar a que mainGame tenga un valor, por eso hago el ternario */}
        {topVideogames && topVideogames.mainVideogame ? (
          <Card
            createdInDB={topVideogames.mainVideogame.createdInDB}
            name={topVideogames.mainVideogame.name}
            image={topVideogames.mainVideogame.image}
            genres={topVideogames.mainVideogame.genres}
            id={topVideogames.mainVideogame.id}
          />
        ) : (
          false
        )}
      </div>

      <div className={styles.sideVideogames}>
        {/* Tengo que esperar a que mainGame tenga un valor, por eso hago el ternario */}
        {topVideogames && topVideogames.sideVideogame1 ? (
          <Card
            createdInDB={topVideogames.sideVideogame1.createdInDB}
            name={topVideogames.sideVideogame1.name}
            image={topVideogames.sideVideogame1.image}
            genres={topVideogames.sideVideogame1.genres}
            id={topVideogames.sideVideogame1.id}
          />
        ) : (
          false
        )}
        {topVideogames && topVideogames.sideVideogame2 ? (
          <Card
            createdInDB={topVideogames.sideVideogame2.createdInDB}
            name={topVideogames.sideVideogame2.name}
            image={topVideogames.sideVideogame2.image}
            genres={topVideogames.sideVideogame2.genres}
            id={topVideogames.sideVideogame2.id}
          />
        ) : (
          false
        )}
      </div>

      <div className={styles.joker}>Hola</div>
      <div className={styles.videogames}>
        {moreVideogames?.map((videogame, index) => {
          return (
            <Card
              setOrder={setOrder}
              createdInDB={videogame.createdInDB}
              key={index}
              name={videogame.name}
              image={videogame.image}
              genres={videogame.genres}
              id={videogame.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
