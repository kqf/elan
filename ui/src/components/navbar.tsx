import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User } from "../schemes";

function NavBar(props: { user?: User }) {
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/", { replace: true });
    window.location.reload();
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/">
        Elan
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
          {props.user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/users">
                Users
              </NavLink>
              <NavLink className="nav-item nav-link" to="/lessons">
                Lessons
              </NavLink>
            </React.Fragment>
          )}
        </div>
      </div>
      <div className="navbar-nav">
        {!props.user && (
          <React.Fragment>
            <NavLink className="nav-item nav-link" to="/login">
              Sign in
            </NavLink>
            <NavLink className="nav-item nav-link" to="/register">
              Sign up
            </NavLink>
          </React.Fragment>
        )}
        {props.user && (
          <NavLink
            className="nav-item nav-link"
            to="/movies"
            onClick={handleLogOut}
          >
            {props.user.username}{" "}
            <i className="fa fa-sign-out" aria-hidden="true"></i>
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
