import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from "mdb-react-ui-kit";

export default function ClientProfile() {
  const { id } = useParams(); 
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchClient() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/clients/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch client");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching client profile:", error);
      }
    }

    fetchClient();
  }, [id]);

  if (!data) {
    return <p style={{ textAlign: "center" }}>Chargement du client...</p>;
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

                <h5 className="my-3">
                  {data.prenom_client} {data.nom_client}
                </h5>

                <p className="text-muted mb-1">Client</p>

                <p className="text-muted mb-4">
                  {data.contact?.adresse_postale ?? "Aucune adresse"}
                </p>

                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn>Modifier les infos</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>

            {/* SOCIALS */}
            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">

                  <MDBListGroupItem className="d-flex align-items-center p-3">
                    <MDBIcon fab icon="facebook fa-lg" className="me-3" />
                    <MDBCardText>
                      {data.contact?.facebook ?? "—"}
                    </MDBCardText>
                  </MDBListGroupItem>

                  <MDBListGroupItem className="d-flex align-items-center p-3">
                    <MDBIcon fab icon="instagram fa-lg" className="me-3" />
                    <MDBCardText>
                      {data.contact?.instagram ?? "—"}
                    </MDBCardText>
                  </MDBListGroupItem>

                  <MDBListGroupItem className="d-flex align-items-center p-3">
                    <MDBIcon fas icon="envelope fa-lg" className="me-3" />
                    <MDBCardText>
                      {data.contact?.email ?? "—"}
                    </MDBCardText>
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
                      {data.prenom_client} {data.nom_client}
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
                      {data.contact?.email ?? "—"}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Téléphones</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    {data.contact?.telephones?.length > 0 ? (
                      data.contact.telephones.map(tel => (
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

            {/* 🔜 ICI PLUS TARD : HISTORIQUE DES COMMANDES */}
          </MDBCol>

        </MDBRow>
      </MDBContainer>
    </section>
  );
}
