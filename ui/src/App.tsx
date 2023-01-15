import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";

import AuthDemo from "./components/authDemo";
import AppMenu from "./components/menuComponent";
import Movies from "./components/movies";
import NavBar from "./components/navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <NavBar />
        <div className="content">
          <Route path="/products" component={"Products"} />
          <Route path="/posts" component={"Posts"} />
        </div>

        <div className="row">
          <div className="col-xs-6 equal-width">
            <AppMenu />
            <Movies />
          </div>
          <div className="col-xs-6 equal-width">
            <AuthDemo />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
