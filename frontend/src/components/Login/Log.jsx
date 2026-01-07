import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";

import "./Log.css";
import stockImage from "../images/stock_cositiques.jpg";

export default function Log() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is_passed , setIs_passed] = useState(true);
  const [messageAlert, setMessageAlert] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

useEffect(() => {
  if (!token) return;

  const checkAuth = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate("/dashboard", { replace: true });
      } else {
        localStorage.removeItem("token");
      }
    } catch {
      localStorage.removeItem("token");
    }
  };

  checkAuth();
}, [token, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nom: nom,
      prenom: prenom,
      email: email,
      password: password,
    };
    console.log("Données soumises :", data);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setIs_passed(false);
        if (response.status === 500) {
          setMessageAlert("Email ou mot de passe incorrect");
        }
        else {
          setMessageAlert("Serveur errereur, réessayez plus tard");
        }
      }

      const result = await response.json();
      console.log("Succès :", result);
      //  sauvegarder le token
      localStorage.setItem("token", result.access_token);
      //  redirection
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setIs_passed(false);
      setMessageAlert("Erreur réseau, réessayez plus tard");
    }
  };

  return (
    <MDBContainer fluid className="my-1 login-container">
      <MDBRow className="g-0 align-items-center">
        <MDBCol md="6">
          <MDBCard
            className="my-5 cascading-right"
            style={{
              background: "hsla(0, 0%, 100%, 0.55)",
              backdropFilter: "blur(30px)",
            }}
          >
            <MDBCardBody className="p-5 shadow-5 text-center">
              <h2 className="fw-bold mb-5">Inscription Admin</h2>

              <form onSubmit={handleSubmit}>
                <MDBRow>
                  {!is_passed && <p style={{color:"red"}}>Email ou mot de passe incorrect</p>}
                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Nom"
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                    />
                  </MDBCol>

                  <MDBCol md="6">
                    <MDBInput
                      wrapperClass="mb-4"
                      label="Prénom"
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      required
                    />
                  </MDBCol>
                </MDBRow>

                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <MDBBtn type="submit" className="w-100 mb-4">
                  S’inscrire
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="6">
          <img
            src={stockImage}
            className="w-100 rounded-4 shadow-4"
            alt="login"
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
