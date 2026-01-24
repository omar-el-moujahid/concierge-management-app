import React, { useState, useEffect } from "react";
import omar from "../images/omar.jpg";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from "mdb-react-ui-kit";

export default function Profil() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!data) {
    return <p style={{ textAlign: "center" }}>Chargement du profil...</p>;
  }

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow>
          {/* LEFT COLUMN */}
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={omar}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />

                <p className="text-muted mb-1">{data.possition}</p>
                <p className="text-muted mb-4">
                  {data.contact.adresse_postale}
                </p>

                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn>Modifier Les infos </MDBBtn>
                  {/* <MDBBtn outline className="ms-1">Message</MDBBtn> */}
                </div>
              </MDBCardBody>
            </MDBCard>

            {/* SOCIALS */}
            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">

                  <MDBListGroupItem className="d-flex align-items-center p-3">
                    <MDBIcon fab icon="facebook fa-lg" className="me-3" />
                    <MDBCardText>{data.contact.facebook}</MDBCardText>
                  </MDBListGroupItem>

                  <MDBListGroupItem className="d-flex align-items-center p-3">
                    <MDBIcon fab icon="instagram fa-lg" className="me-3" />
                    <MDBCardText>{data.contact.instagram}</MDBCardText>
                  </MDBListGroupItem>

                  <MDBListGroupItem className="d-flex align-items-center p-3">
                    <MDBIcon fas icon="envelope fa-lg" className="me-3" />
                    <MDBCardText>{data.contact.email}</MDBCardText>
                  </MDBListGroupItem>

                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          {/* RIGHT COLUMN */}
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Nom complet</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {data.nom} {data.prenom}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {data.email}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Téléphones</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {data.contact.telephones.length > 0 ? (
                      data.contact.telephones.map((tel) => (
                        <MDBCardText
                          className="text-muted"
                          key={tel.id_telephone}
                        >
                          {tel.numero} ({tel.type})
                        </MDBCardText>
                      ))
                    ) : (
                      <MDBCardText className="text-muted">
                        Aucun téléphone
                      </MDBCardText>
                    )}
                  </MDBCol>
                </MDBRow>

              </MDBCardBody>
            </MDBCard>

            {/* SKILLS (optionnel, statique) */}
            {/* <MDBRow>
              <MDBCol md="6">
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardText className="mb-3">Backend API</MDBCardText>
                    <MDBProgress>
                      <MDBProgressBar width={80} />
                    </MDBProgress>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow> */}

          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
