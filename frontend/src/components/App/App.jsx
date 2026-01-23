import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "../Dashboard/Dashboard";
import Log from "../Login/Log";
import ProtectedRoute from "../security/ProtectedRoute";
import Profil from "../profil/profil";
import AdminLayout from "../layouts/layouts";
import HeaderNavigation from "../header/header";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <div className="">
        <Routes>
          <Route  path='/' element={<Log />} />
          <Route path="/log" element={<Log />} />
          <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
              >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profil" element={<Profil />} />
        </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

