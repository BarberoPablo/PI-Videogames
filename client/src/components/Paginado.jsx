import React from "react";

/**
 *setSpecialVideogames = {
    mainGame: allVideogames[0],
    sideVideogame1: allVideogames[1],
    sideVideogame2: allVideogames[2],
  }
 *
 * @param {videogamesPerPage} videogamesPerPage videojuegos por página
 * @param {videogamesAmount} videogamesAmount cantidad total de videogames
 * @param {paginado} paginado funcion para cambiar de pagina
 * @param {setSpecialVideogames} specialVideogames funcion para cambiar mainVideogame y sideVideogames
 */
export default function Paginado({ videogamesPerPage, videogamesAmount, paginado, setSpecialVideogames }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(videogamesAmount / videogamesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="paginado">
        {pageNumbers?.map((page) => (
          <li className="page" key={page}>
            <a onClick={() => paginado(page)}>{page}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
