import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaConciergeBell,
  FaFileInvoiceDollar,
  FaEnvelope,
  FaChartPie,
  FaCog,
  FaUserTie
} from "react-icons/fa";

import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Conciergerie</div>

      <ul className="sidebar-menu">
        {/* Dashboard */}
        <li onClick={() => navigate("/dashboard")}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </li>

        {/* Clients */}
        <li onClick={() => navigate("/clients")}>
          <FaUsers />
          <span>Clients</span>
        </li>
    
        {/* Commandes */}
        <li onClick={() => navigate("/commande")}>
          <FaClipboardList />
          <span>Commandes</span>
        </li>

        {/* Services */}
        <li onClick={() => navigate("/services")}>
          <FaConciergeBell />
          <span>Services</span>
        </li>

        {/* Facturation */}
        <li onClick={() => navigate("/facturation")}>
          <FaFileInvoiceDollar />
          <span>Facturation</span>
        </li>

      
        {/* Profil */}
        <li onClick={() => navigate("/profil")}>
          <FaUsers />
          <span>Profil</span>
        </li>

        {/* Paramètres */}
        <li onClick={() => navigate("/parametres")}>
          <FaCog />
          <span>Paramètres</span>
        </li>
      </ul>
    </aside>
  );
}
