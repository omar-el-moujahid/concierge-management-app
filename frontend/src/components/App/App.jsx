import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "../Dashboard/Dashboard";
import ProtectedRoute from "../security/ProtectedRoute";
import Profil from "../profil/profil";
import AdminLayout from "../layouts/layouts";
import LoginAdmin from "../LoginAdmin/LoginAdmin";
import LoginClient from "../LoginClient/LoginClient";
import SigninClient from "../SigninClient/SigninClient";
import HeaderNavigation from "../header/header";
import "./App.css";
// import ClientsPage from "../Client/ClientsPage";
import ClientsPage from "../Client/ClientsPage";
import ClientProfil from "../Client/Client";
function App() {
  return (
    <BrowserRouter>
      <div className="">
        <Routes>
          <Route  path='/' element={<LoginAdmin />} />
          <Route path="/loginadmin" element={<LoginAdmin />} />
          <Route path="/loginclient" element={<LoginClient />} />
          <Route path="/signinclient" element={<SigninClient />} />
          <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
              >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/:id" element={<ClientProfil />} />
              <Route path="/Admin" element={<Dashboard />} />
        </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

