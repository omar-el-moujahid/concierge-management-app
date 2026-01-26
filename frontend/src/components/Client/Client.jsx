import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  MDBListGroupItem,
} from "mdb-react-ui-kit";

const STATUS_MAP = {
  to_buy: { label: "À acheter", class: "bg-secondary" },
  bought: { label: "Acheté", class: "bg-info" },
  packed: { label: "Préparée", class: "bg-warning text-dark" },
  shipped: { label: "Expédiée", class: "bg-primary" },
  arrived: { label: "Arrivée", class: "bg-success" },
  delivered: { label: "Livrée", class: "bg-success" },
  done: { label: "Terminée", class: "bg-dark" },
};

export default function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [loadingCmd, setLoadingCmd] = useState(true);

  useEffect(() => {
    async function fetchClientAndCommandes() {
      try {
        const [response, responseCmd] = await Promise.all([
          fetch(`http://127.0.0.1:8000/clients/${id}`),
          fetch(`http://127.0.0.1:8000/commandes/liste/summary/${id}`), // ✅ endpoint correct
        ]);

        if (!response.ok) throw new Error("Failed to fetch client");
        if (!responseCmd.ok) throw new Error("Failed to fetch commandes");

        const result = await response.json();
        const resultCmd = await responseCmd.json();

        setData(result);
        setCommandes(resultCmd);
      } catch (error) {
        console.error("Error fetching client profile:", error);
      } finally {
        setLoadingCmd(false);
      }
    }

    fetchClientAndCommandes();
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
                    <MDBCardText>{data.contact?.facebook ?? "—"}</MDBCardText>
                  </MDBListGroupItem>

                  <MDBListGroupItem className="d-flex align-items-center p-3">
                    <MDBIcon fab icon="instagram fa-lg" className="me-3" />
                    <MDBCardText>{data.contact?.instagram ?? "—"}</MDBCardText>
                  </MDBListGroupItem>

                  <MDBListGroupItem className="d-flex align-items-center p-3">
                    <MDBIcon fas icon="envelope fa-lg" className="me-3" />
                    <MDBCardText>{data.contact?.email ?? "—"}</MDBCardText>
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
                      data.contact.telephones.map((tel) => (
                        <MDBCardText className="text-muted" key={tel.id_telephone}>
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
                <hr />

                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Adresse</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {data.contact?.adresse_postale ?? "Aucune adresse"}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

            {/* ✅ HISTORIQUE DES COMMANDES */}
            <MDBCard className="mb-4">
              <MDBCardBody className="p-0">
                {loadingCmd ? (
                  <div className="p-3 text-muted">Chargement des commandes...</div>
                ) : (
                  <table className="table align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Date</th>
                        <th>Référence</th>
                        <th>Membre</th>
                        <th>Produits</th>
                        <th>Montant</th>
                        <th>Moyen de paiement</th>
                        <th>État du paiement</th>
                        <th>État de la commande</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {commandes.map((cmd) => {
                        const statusConfig =
                          STATUS_MAP[cmd.status] || {
                            label: cmd.status,
                            class: "bg-secondary",
                          };

                        return (
                          <tr key={cmd.id_commande}>
                            <td>{new Date(cmd.date_commande).toLocaleDateString()}</td>

                            <td className="text-primary fw-bold">
                              CMD-{cmd.id_commande}
                            </td>

                            <td>
                              {cmd.client?.prenom_client} {cmd.client?.nom_client}
                            </td>

                            <td>
                              {cmd.details?.length > 0 ? (
                                <div className="d-flex align-items-center gap-1">
                                  {cmd.details.slice(0, 3).map((d) => (
                                    <span
                                      key={d.id_detail}
                                      className="rounded-circle bg-light d-inline-flex justify-content-center align-items-center"
                                      style={{ width: 32, height: 32 }}
                                      title={d.produit?.libelle}
                                    >
                                      🛍️
                                    </span>
                                  ))}
                                  {cmd.details.length > 3 && (
                                    <span className="text-muted small">
                                      +{cmd.details.length - 3}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>

                            <td>
                              {cmd.facture ? `${cmd.facture.montant_total} €` : "—"}
                            </td>

                            <td>
                              {/* {cmd.facture?.paiements?.length > 0
                                ? cmd.facture.paiements[0].moyen_paiement
                                : "Par carte bancaire"} */}
                                Par carte bancaire
                            </td>

                            <td>
                              {cmd.facture?.paiements?.length > 0 ? (
                                <span className="badge bg-success-subtle text-success">
                                  PAYÉ
                                </span>
                              ) : (
                                <span className="badge bg-warning-subtle text-warning">
                                  EN ATTENTE
                                </span>
                              )}
                            </td>

                            <td>
                              <span className={`badge ${statusConfig.class}`}>
                                {statusConfig.label}
                              </span>
                            </td>

                            <td>
                              <MDBIcon
                                fas
                                icon="ellipsis-h"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/commandes/${cmd.id_commande}`)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
