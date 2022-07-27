import React from "react";
import { Link } from "react-router-dom";

const LandingPage = ()=> {
  return (
    <div>
      <h1> Welcome to the world of videogames</h1>
      <Link to="/home">
        <button>Enter the world</button>
      </Link>
    </div>
  );
}

export default LandingPage;
