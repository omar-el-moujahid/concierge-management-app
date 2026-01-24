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

        {/* Demandes / Services */}
        <li onClick={() => navigate("/demandes")}>
          <FaClipboardList />
          <span>Demandes</span>
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

        {/* Messages */}
        <li onClick={() => navigate("/messages")}>
          <FaEnvelope />
          <span>Messages</span>
        </li>

        {/* Statistiques */}
        <li onClick={() => navigate("/statistiques")}>
          <FaChartPie />
          <span>Statistiques</span>
        </li>

        {/* Équipe */}
        <li onClick={() => navigate("/equipe")}>
          <FaUserTie />
          <span>Équipe</span>
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
