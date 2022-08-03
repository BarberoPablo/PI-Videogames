import React from "react";
import styles from "./Paginado.module.css";
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
export default function Paginado({
  videogamesPerPage,
  videogamesAmount,
  paginado,
  setSpecialVideogames,
  currentPage,
  setCurrentPage,
}) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(videogamesAmount / videogamesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleClick = (e) => {
    e.preventDefault();
    console.log("currentPage", currentPage);
    if (e.target.name === "Prev") {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <nav>
      <ul className="paginado">
        <li className={styles.list}>
          {currentPage !== 1 && pageNumbers.length > 1 ? (
            <button className={styles.pageNumber} name="Prev" onClick={(e) => handleClick(e)}>
              Prev
            </button>
          ) : (
            false
          )}
        </li>
        {pageNumbers?.map((page) => (
          <li className={styles.list} key={page}>
            <button className={styles.pageNumber} onClick={() => paginado(page)}>
              {page}
            </button>
          </li>
        ))}
        <li className={styles.list}>
          {currentPage !== pageNumbers.length && pageNumbers.length > 1 ? (
            <button className={styles.pageNumber} name="Next" onClick={(e) => handleClick(e)}>
              Next
            </button>
          ) : (
            false
          )}
        </li>
      </ul>
    </nav>
  );
}
