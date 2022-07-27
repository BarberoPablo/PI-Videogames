import "./App.css";
import { Route, Switch, Link } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";

function App() {
  //render me pasa como props: history, location y match
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/home" component={Home} />
      </Switch>
    </div>
  );
}
/* 

*/

export default App;
