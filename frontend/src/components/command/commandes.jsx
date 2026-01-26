import React, { useEffect, useState } from "react";
import { Table, Badge, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [loadingCmd, setLoadingCmd] = useState(true);
  const STATUS_MAP = {
  to_buy: { label: "À acheter", class: "bg-secondary" },
  bought: { label: "Acheté", class: "bg-info" },
  packed: { label: "Préparée", class: "bg-warning text-dark" },
  shipped: { label: "Expédiée", class: "bg-primary" },
  arrived: { label: "Arrivée", class: "bg-success" },
  delivered: { label: "Livrée", class: "bg-success" },
  done: { label: "Terminée", class: "bg-dark" },
};
  useEffect(() => {
    async function fetchCommandes() {
      try {
        const response = await  fetch(`http://127.0.0.1:8000/commandes/summary`);
        

        if (!response.ok) throw new Error("Failed to fetch commandes");

        const result = await response.json();
        setCommandes(result);
        console.log("Fetched commandes:", result);
      } catch (error) {
        console.error("Error fetching commandes", error);
      } finally {
        setLoadingCmd(false);
      }
    }
    fetchCommandes();
  }, [loadingCmd]);


  const handleEdit = (id) => {
  // navigation vers page modification
  navigate(`/commandes/edit/${id}`);
};

const submit_facture = (id) => {
  // navigation vers page modification
  navigate(`/factures/${id}`);
}
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Êtes-vous sûr de vouloir supprimer cette commande ?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/commandes/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression");
    }

    setCommandes((prev) =>
      prev.filter((cmd) => cmd.id_commande !== id)
    );
  } catch (error) {
    console.error("Erreur suppression commande :", error);
    alert("Impossible de supprimer la commande");
  }
};

const exportExcel = () => {
  window.open("http://127.0.0.1:8000/commandes/export/excel", "_blank");
};

const  navigate = useNavigate();
  return (
    <div className="p-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Commandes</h3>
          <small className="text-muted">
            Creer et manager des commandes
          </small>
        </div>
        <Button variant="primary" onClick={() => navigate("/commandes/new")}>+ Nouvelle Commande</Button>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <small className="text-muted">
            Telecharger les comandes sur Exel
          </small>
        </div>
        <Button variant="primary" onClick={exportExcel}>Telecharger</Button>
      </div>

      {/* Card */}
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <h5 className="fw-semibold mb-3">📄 Historique des Commandes</h5>

          <Table responsive hover className="align-middle">
            <thead className="text-muted small">
              <tr>
                <th>COMMANDE #</th>
                <th>CLIENT</th>
                <th>DATE de commande</th>
                {/* <th>DATE d Arrivée</th> */}
                <th>ITEMS</th>
                <th>nbr d articel </th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>PAYMENT</th>
                <th>Facturation</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

           <tbody>
            {commandes.map((cmd) => {
              const statusConfig =
                STATUS_MAP[cmd.status] || {
                  label: cmd.status,
                  class: "bg-secondary",
                };

              const isArrived = ["arrived", "delivered", "done"].includes(cmd.status);

              return (
                <tr key={cmd.id_commande}>
                  {/* COMMANDE # */}
                  <td className="fw-semibold">
                    #{cmd.id_commande}
                  </td>

                  {/* CLIENT */}
                  <td>
                    {cmd.client
                      ? `${cmd.client.prenom_client} ${cmd.client.nom_client}`
                      : "—"}
                  </td>

                  {/* DATE CRÉATION */}
                  <td>
                    {new Date(cmd.date_commande).toLocaleDateString()}
                  </td>

                  {/* DATE ARRIVÉE */}
                  {/* <td>
                    {cmd.date_arriver ? 
                    new Date(cmd.date_arriver).toLocaleDateString()
                      : "—"}
                  </td> */}

                  {/* Produits */}
                  <td>
                    {cmd.details?.length > 0 ?
                      cmd.details.map((detail) => (
                        <div key={detail.id_detail}>
                          {detail.produit ? detail.produit.libelle : "—"}
                        </div>
                      ))
                      : "—"}
                  </td>

                  {/* ITEMS (nombre d’articles) */}
                  <td>
                    {cmd.details?.length ?? 0}
                  </td>

                  {/* TOTAL */}
                  <td className="fw-semibold">
                    {cmd.facture ? `${cmd.facture.montant_total} €` : "—"}
                  </td>

                  {/* STATUS */}
                  <td>
                    <Badge className={statusConfig.class} pill>
                      {statusConfig.label}
                    </Badge>
                  </td>

                  {/* PAYMENT */}
                  <td>
                    {cmd.facture?.paiements?.length > 0 ? (
                      <Badge bg="success" pill>
                        PAYÉ
                      </Badge>
                    ) : (
                      <Badge bg="warning" text="dark" pill>
                        EN ATTENTE
                      </Badge>
                    )}
                  </td>
                  {/* FACTURATION */}
                  <td>
                    {cmd.facture?.paiements?.length > 0 ? (
                      <button className="btn btn-primary btn-sm" onClick={() => submit_facture(cmd.id_commande)} style={{maxWidth: "80px"}}>
                        Consulter Facture
                      </button>
                      ) : (
                       <button className="btn btn-warning btn-sm" onClick={() => submit_facture(cmd.id_commande)} style={{maxWidth: "80px"}}>
                        Facturiser
                      </button>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(cmd.id_commande)}
                    >
                      ✏️
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(cmd.id_commande)}
                    >
                      🗑️
                    </Button>
                  </td>

                </tr>
              );
            })}
          </tbody>


          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
