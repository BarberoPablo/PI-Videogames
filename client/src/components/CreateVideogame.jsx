import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getGenres, createVideogame } from "../actions";
import styles from "./CreateVideogame.module.css";
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
  }, [dispatch]);

  const [details, setDetails] = useState({
    name: "",
    image:
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dmlkZW8lMjBnYW1lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    description: "",
    released: "",
    rating: "",
    platforms: [],
    genres: [],
  });

  const videogamesPlatforms = [
    "PC",
    "PlayStation5",
    "PlayStation4",
    "Xbox One",
    "Xbox 360",
    "Nintendo Switch",
    "Android",
  ];

  const handleFormChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value, //accedo con [] porque necesito el valor de id, si no lo pongo me toma literal "e.target.value"
    });
  };

  const handleCheckbox = (e) => {
    if (e.target.checked) {
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
  };

  const handleGenres = (e) => {
    e.preventDefault();
    const genre = e.target.value;
    if (!details.genres.includes(genre)) {
      setDetails({
        ...details,
        genres: [...details.genres, genre],
      });
    }
  };

  const handleCreateVideogame = async (e) => {
    e.preventDefault();
    try {
      // En el back hago el validador del form (en el post videogame)
      // Uso await porque quiero saber si se hizo con exito post para limpiar los inputs o no
      console.log(details);
      await dispatch(createVideogame(details));
      setDetails({
        name: "",
        image:
          "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dmlkZW8lMjBnYW1lfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        description: "",
        released: "",
        rating: "",
        platforms: [],
        genres: [],
      });
    } catch (error) {
      alert("Missing data, name, description, rating (min 0 max 5), platforms and genres are required");
    }
  };

  const handleRemoveGenre = (e) => {
    e.preventDefault();
    const genreToRemove = e.target.name;
    console.log("genres:", details.genres);
    setDetails({
      ...details,
      genres: details.genres.filter((genre) => genre !== genreToRemove),
    });
    console.log("genres:", details.genres);
    alert(`Genre ${e.target.name} deleted`);
    //console.log(e.target.name);
  };

  return (
    <div className={styles.container}>
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
            {details.genres?.map((genre, index) => (
              <li>
                <button key={index} name={genre} onClick={(e) => handleRemoveGenre(e)}>
                  {genre}
                </button>
              </li>
            ))}
          </ul>
          {/* <ul>
            <li onClick={(e) => handleRemoveGenre(e)}>
              {details.genres?.map((genre) => {
                // La razon es este if es para que se vea mas lindo los guiones
                if (genre !== details.genres[details.genres.length - 1]) {
                  return genre + " - ";
                } else {
                  return genre;
                }
              })}
            </li>
          </ul> */}
        </div>

        {/*Este boton dispara el onSubmit:*/}
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateVideogame;
