import React from "react";
import omar from "../images/omar.jpg";
import logo from "../images/logo.png";
import { useNavigate } from "react-router-dom";

function HeaderNavigation() {
  const navigate = useNavigate();

  const handleProfil = () => {
    navigate("/profil");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    navigate("/loginadmin");
  };

  return (
    <header className="bg-light border-bottom px-4 py-3 sticky-top">
      <div className="bg-white rounded shadow-sm px-4 py-2 w-100">
        <div className="d-flex align-items-center justify-content-between w-100">

          {/* LEFT */}
          <div className="d-flex align-items-center gap-4">
            <img src={logo} alt="logo" height="36" />
            <strong className="fs-5">Conciergerie</strong>
          </div>

          {/* RIGHT */}
          <div className="d-flex align-items-center gap-4">
            <span>
              Contact <span className="badge bg-info ms-1">3</span>
            </span>

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
                  <button className="dropdown-item" onClick={handleProfil}>
                    Profil
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
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
