import React from "react";

/**
 *
 * @param {videogamesPerPage} videogamesPerPage videojuegos por página
 * @param {videogamesAmount} videogamesAmount cantidad total de videogames
 * @param {paginado} paginado cambio el numero de pagina
 */
export default function Paginado({ videogamesPerPage, videogamesAmount, paginado }) {
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
