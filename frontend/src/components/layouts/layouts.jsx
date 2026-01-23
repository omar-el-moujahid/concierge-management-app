import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import HeaderNavigation from "../header/header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="d-flex min-vh-100 bg-light">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-grow-1" style={{ marginLeft: "240px" }}>
         {/* header */}
        <HeaderNavigation />
        <main className="p-4">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
