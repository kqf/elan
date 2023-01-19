import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/">
        MyApp
      </NavLink>
      <div className="navbar-nav">
        <NavLink className="nav-item nav-link" to="/">
          Home
        </NavLink>
        <NavLink className="nav-item nav-link" to="/calc">
          Calculator
        </NavLink>
        <NavLink className="nav-item nav-link" to="/products">
          Products
        </NavLink>
        <NavLink className="nav-item nav-link" to="/posts">
          Posts
        </NavLink>
        <NavLink className="nav-item nav-link" to="/auth">
          Auth
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
