import React, { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AjouterCommande() {
  const navigate = useNavigate();

  /* =======================
     STATES
  ======================= */
  const [clients, setClients] = useState([]);
  const [produits, setProduits] = useState([]);

  const [commande, setCommande] = useState({
    id_client: "",
    status: "to_buy",
    note: "",
    date_commande: new Date().toISOString(),
    date_arriver: null,
    details: [
  {
    id_produit: "",
    quantite: 1,
    prix_catalogue: 0.0,
    prix_applique: 0.0,
    remise: 0.0,
  },
],
  });

  /* =======================
     FETCH CLIENTS & PRODUITS
  ======================= */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/clients")
      .then((res) => res.json())
      .then(setClients)
      .catch(console.error);

    fetch("http://127.0.0.1:8000/produits/liste")
      .then((res) => res.json())
      .then(setProduits)
      .catch(console.error);
  }, []);

  /* =======================
     GESTION DES PRODUITS
  ======================= */
  const ajouterProduit = () => {
    setCommande({
      ...commande,
      details: [
        ...commande.details,
        {
          id_produit: "",
          quantite: 1,
          prix_catalogue: 0,
          prix_applique: 0,
          remise: 0,
        },
      ],
    });
  };

  const supprimerProduit = (index) => {
    const details = [...commande.details];
    details.splice(index, 1);
    setCommande({ ...commande, details });
  };

  const modifierProduit = (index, champ, valeur) => {
    const details = [...commande.details];
    details[index][champ] = valeur;

    if (champ === "id_produit") {
      const produit = produits.find(
        (p) => p.id_produit === Number(valeur)
      );
      if (produit) {
        details[index].prix_catalogue = produit.prix_catalogue;
        details[index].prix_applique = produit.prix_catalogue;
      }
    }

    setCommande({ ...commande, details });
  };

  /* =======================
     CALCUL TOTAL
  ======================= */
  const total = commande.details.reduce(
    (sum, d) =>
      sum +
      d.quantite * (d.prix_applique - d.remise),
    0
  );

  /* =======================
     SUBMIT
  ======================= */
  const creerCommande = async () => {
  const body = {
    date_commande: new Date(commande.date_commande)
      .toISOString()
      .split("T")[0], // YYYY-MM-DD

    date_arriver: commande.date_arriver
      ? new Date(commande.date_arriver).toISOString().split("T")[0]
      : null,

    status: commande.status,
    note: commande.note,
    id_client: Number(commande.id_client),

    detailscommande: commande.details.map((d) => ({
      id_produit: Number(d.id_produit),
      prix_catalogue: Number(d.prix_catalogue).toFixed(2),
      prix_applique: Number(d.prix_applique).toFixed(2),
      quantite: Number(d.quantite),
      remise: Number(d.remise).toFixed(2),
    })),
  };

  console.log("JSON envoyé :", body); 

  const response = await fetch("http://127.0.0.1:8000/commande", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error("Erreur lors de la création");
    navigate("/commandes");
};


  /* =======================
     RENDER
  ======================= */
  return (
    <div className="p-4 bg-light min-vh-100">
      <h3 className="fw-bold mb-1">Commandes</h3>
      <p className="text-muted mb-4">
        Créer et gérer les commandes clients
      </p>

      {/* CLIENT */}
      <Card className="mb-4 shadow-sm rounded-4">
        <Card.Body>
          <h6>👤 Informations client</h6>

          <Form.Select
            value={commande.id_client}
            onChange={(e) =>
              setCommande({ ...commande, id_client: e.target.value })
            }
          >
            <option value="">Choisir un client...</option>
            {clients.map((c) => (
              <option key={c.id_client} value={c.id_client}>
                {c.prenom_client} {c.nom_client} — {c.contact?.email}
              </option>
            ))}
          </Form.Select>

          <Button
            variant="link"
            className="p-0 mt-2"
            onClick={() => navigate("/clients/new")}
          >
            + Créer un nouveau client
          </Button>
        </Card.Body>
      </Card>

      {/* PRODUITS */}
      <Card className="mb-4 shadow-sm rounded-4">
        <Card.Body>
          <h6>📦 Produits commandés</h6>

          {commande.details.map((d, index) => (
            <Row className="align-items-center mb-2" key={index}>
              <Col md={5}>
                <Form.Select
                  onChange={(e) =>
                    modifierProduit(
                      index,
                      "id_produit",
                      e.target.value
                    )
                  }
                >
                  <option value="">Sélectionner un produit</option>
                  {produits.map((p) => (
                    <option key={p.id_produit} value={p.id_produit}>
                      {p.libelle} – {p.prix_catalogue} €
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Control
                  type="number"
                  min="1"
                  value={d.quantite}
                  onChange={(e) =>
                    modifierProduit(
                      index,
                      "quantite",
                      Number(e.target.value)
                    )
                  }
                />
              </Col>

              <Col md={3} className="fw-bold">
                {(d.quantite * d.prix_applique).toFixed(2)} €
              </Col>

              <Col md={2}>
                <Button
                  variant="outline-danger"
                  onClick={() => supprimerProduit(index)}
                >
                  ✕
                </Button>
              </Col>
            </Row>
          ))}

          <Button variant="link" onClick={ajouterProduit}>
            + Ajouter un autre produit
          </Button>
        </Card.Body>
      </Card>

      {/* STATUT */}
      <Card className="mb-4 shadow-sm rounded-4">
        <Card.Body>
          <h6>📌 Statut & Note</h6>

          <Form.Select
            className="mb-3"
            value={commande.status}
            onChange={(e) =>
              setCommande({ ...commande, status: e.target.value })
            }
          >
            <option value="to_buy">À acheter</option>
            <option value="bought">Acheté</option>
            <option value="packed">Préparée</option>
            <option value="shipped">Expédiée</option>
            <option value="arrived">Arrivée</option>
          </Form.Select>

          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Note interne (optionnelle)"
            value={commande.note}
            onChange={(e) =>
              setCommande({ ...commande, note: e.target.value })
            }
          />
        </Card.Body>
      </Card>

      {/* TOTAL */}
      <Card className="shadow-sm rounded-4">
        <Card.Body>
          <div className="d-flex justify-content-between fs-5">
            <strong>Total</strong>
            <strong>{total.toFixed(2)} €</strong>
          </div>

          <Button
            className="w-100 mt-3"
            size="lg"
            onClick={creerCommande}
          >
            ✔ Créer la commande
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
