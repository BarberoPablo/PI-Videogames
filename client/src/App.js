import "./App.css";
import { Route, Switch, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import CreateVideogame from "./components/CreateVideogame";

function App() {
  //render me pasa como props: history, location y match
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/create" component={CreateVideogame} />
      </Switch>
    </div>
  );
}

export default App;
