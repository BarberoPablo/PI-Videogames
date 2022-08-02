import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.parent}>
      <h1 className={styles.title}> Welcome to the world of videogames</h1>
      <Link to="/home">
        <img
          className={styles.coinImg}
          src="https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif"
          alt="enter image"
        />
      </Link>
      {/* <Link to="/home">
        <img
          className={styles.pileImg}
          src="https://bestanimations.com/media/coins/781167865gold-coins-animated-gif.gif"
          alt="enter image"
        />
      </Link> */}
    </div>
  );
};

export default LandingPage;
