import React from "react";
import { NavLink } from "react-router-dom";
import { User } from "../fakeBackend";

function NavBar(props: { user?: User }) {
  const handleLogOut = () => {
    console.log("Removed the item");
    localStorage.removeItem("accessToken");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/">
        MyApp
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
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
          <NavLink className="nav-item nav-link" to="/blog">
            Blog
          </NavLink>
          <NavLink className="nav-item nav-link" to="/auth">
            Auth
          </NavLink>
          {!props.user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-item nav-link" to="/register">
                Register
              </NavLink>
            </React.Fragment>
          )}
          {props.user && (
            <NavLink
              className="nav-item nav-link"
              to="/"
              onClick={handleLogOut}
            >
              {props.user.username}
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
