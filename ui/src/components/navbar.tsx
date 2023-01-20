import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/">
        MyApp
      </NavLink>
      <button className="navbar-toggler">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse">
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
      </div>
    </nav>
  );
}

export default NavBar;
