import React, { FC } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Make sure Bootstrap JS is imported

const Header = () => {
  return (
    <header className="p-3 bg-dark text-white">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link
            to="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
          >
            <h2 className="text-white">Paint Stock System</h2>
          </Link>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>
              <Link to="movies" className="nav-link px-2 text-white">
                All Movies
              </Link>
            </li>
            <li>
              <a href="#" className="nav-link px-2 text-white">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="nav-link px-2 text-white">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="nav-link px-2 text-white">
                About
              </a>
            </li>
          </ul>

          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
            <input
              type="search"
              className="form-control form-control-dark"
              placeholder="Search..."
              aria-label="Search"
            />
          </form>

          <div className="text-end">
            {false ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle me-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {loggedInUser.username}
                </button>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                  <li>
                  <Link to="export" className="dropdown-item">
                  Export
                </Link>
                    
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={handleLogout}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="login" className="btn btn-outline-light me-2">
                  Login
                </Link>
                <Link to="signup" className="btn btn-warning">
                  Sign-up
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
