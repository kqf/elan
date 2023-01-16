import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./App.css";

import AuthDemo from "./components/authDemo";
import AppMenu from "./components/menuComponent";
import Movies from "./components/movies";

function Onepager() {
  return (
    <div className="row">
      <div className="col-xs-6 equal-width">
        <AppMenu />
        <Movies />
      </div>
      <div className="col-xs-6 equal-width">
        <AuthDemo />
      </div>
    </div>
  );
}

function App() {
  return <Onepager />;
}

export default App;
