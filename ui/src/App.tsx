import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./App.css";

import AppMenu from "./components/menuComponent";
import Movies from "./components/movies";
import SinglePageApp from "./components/routingDemo";

function Onepager() {
  return (
    <div className="row">
      <div className="col-xs-6 equal-width">
        <AppMenu />
        <Movies />
      </div>
    </div>
  );
}

function App() {
  return <SinglePageApp />;
}

export default App;
