import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getGenres, createVideogame } from "../actions";

/*
[ ] Un formulario controlado con JavaScript con los siguientes campos:
Nombre
Descripción
Fecha de lanzamiento
Rating
[ ] Posibilidad de seleccionar/agregar varios géneros
[ ] Posibilidad de seleccionar/agregar varias plataformas
[ ] Botón/Opción para crear un nuevo videojuego
Es requisito que el formulario de creación esté validado con JavaScript y no sólo con validaciones HTML.
  Pueden agregar las validaciones que consideren. Por ejemplo: Que el nombre del juego no pueda contener 
    algunos símbolos, que el rating no pueda exceder determinado valor, etc.
*/
const CreateVideogame = () => {
  const dispatch = useDispatch();
  const allGenres = useSelector((state) => state.genres);

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  const [details, setDetails] = useState({
    name: undefined,
    description: undefined,
    released: undefined,
    rating: undefined,
    platforms: [],
    genres: [],
  });

  const [videogamesPlatforms, setVideogamesPlatforms] = useState([
    "PC",
    "PlayStation5",
    "PlayStation4",
    "Xbox One",
    "Xbox 360",
    "Nintendo Switch",
    "Android",
  ]);

  const handleFormChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value, //accedo con [] porque necesito el valor de id, si no lo pongo me toma literal "e.target.value"
    });
    //console.log("Details:", details);
  };

  const handleCheckbox = (e) => {
    //console.log("se clickeo:", e.target.name);
    if (e.target.checked) {
      //console.log("Se tildó");
      setDetails({
        ...details,
        platforms: [...details.platforms, e.target.name], //cambio su valor cada vez que toca la checkbox, luego solo me traigo los true al crear el videogame
      });
    } else {
      setDetails({
        ...details,
        platforms: details.platforms?.filter((platform) => platform !== e.target.name), //cambio su valor cada vez que toca la checkbox, luego solo me traigo los true al crear el videogame
      });
    }
    //console.log("Detalles:", details);
  };

  const handleGenres = (e) => {
    e.preventDefault();
    const genre = e.target.value;
    //console.log("handleGenres:", genre);
    if (!details.genres.includes(genre)) {
      setDetails({
        ...details,
        genres: [...details.genres, genre],
      });
    }
  };

  const handleCreateVideogame = (e) => {
    e.preventDefault();
    console.log("Create details,", details);
    dispatch(createVideogame(details));
    setDetails({
      name: undefined,
      description: undefined,
      released: undefined,
      rating: undefined,
      platforms: [],
      genres: [],
    });
  };

  return (
    <div>
      <Link to="/home">
        <button>Go back</button>
      </Link>

      <h1>Create videogame</h1>

      <form onSubmit={(e) => handleCreateVideogame(e)}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            autoComplete="off"
            value={details.name}
            onChange={(e) => {
              return handleFormChange(e);
            }}
          />
        </div>
        <div>
          {/* Probar un text area para description */}
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            autoComplete="off"
            value={details.description}
            onChange={(e) => handleFormChange(e)}
            require
          />
        </div>
        <div>
          <label htmlFor="released">Released date</label>
          <input
            type="date"
            name="released"
            autoComplete="off"
            value={details.released}
            onChange={(e) => handleFormChange(e)}
          />
        </div>
        <div>
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            name="rating"
            autoComplete="off"
            value={details.rating}
            onChange={(e) => handleFormChange(e)}
          />
        </div>
        <div>
          <label htmlFor="platforms">Platforms</label>
          <div>
            {videogamesPlatforms.map((platform) => (
              <label htmlFor="accept" key={platform}>
                <input type="checkbox" name={platform} value={details.platforms} onChange={(e) => handleCheckbox(e)} />
                {platform}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="genres">Genres</label>
          <select onChange={(e) => handleGenres(e)}>
            <option selected disabled>
              *;..;*
            </option>
            {allGenres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <ul>
            <li>
              {details.genres?.map((genre) => {
                // La razon es este if es para que se vea mas lindo los guiones
                if (genre !== details.genres[details.genres.length - 1]) {
                  return genre + " - ";
                } else {
                  return genre;
                }
              })}
            </li>
          </ul>
        </div>

        {/*Este boton dispara el onSubmit:*/}
        <button type="submit">BUSCAR </button>
      </form>
    </div>
  );
};

export default CreateVideogame;