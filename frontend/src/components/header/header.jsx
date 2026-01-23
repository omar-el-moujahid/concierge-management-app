import React from "react";
import { Navbar, Nav, Container, Form, FormControl, Badge } from "react-bootstrap";
import omar from "../images/omar.jpg";
import logo from "../images/logo.png";
function HeaderNavigation() {
  return (
    <header className="bg-light border-bottom px-5 py-4">
      <div className="bg-white rounded shadow-sm px-4 py-2 w-100">
        <div className="d-flex align-items-center justify-content-between w-100">

{/* LEFT */}
          <div className="d-flex align-items-center gap-4">
            
            <img
              src={logo}
              alt="logo"
              height="36"
            />

            
            <nav className="d-flex gap-3 ms-4">
              <a className="nav-link p-0" ><strong className="fs-5">Conciergerie</strong></a>
            </nav>
          </div>

{/* RIGHT */}
          <div className="d-flex align-items-center gap-4">
            <a className="nav-link p-0">
                Contact <span className="badge bg-info ms-1">3</span>
              </a>
            <div className="dropdown">
              <img
                src={omar}
                alt="avatar"
                className="rounded-circle dropdown-toggle"
                width="36"
                height="36"
                role="button"
                data-bs-toggle="dropdown"
              />

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item">Profil</button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default HeaderNavigation;
