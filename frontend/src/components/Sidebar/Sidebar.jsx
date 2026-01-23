import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaEnvelope,
  FaChartPie,
  FaCog
} from "react-icons/fa";

import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Conciergerie</div>

      <ul className="sidebar-menu">
        <li onClick={() => navigate("/dashboard")}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </li>

        <li onClick={() => navigate("/profil")}>
          <FaUsers />
          <span>Profil</span>
        </li>
      </ul>
    </aside>
  );
}
