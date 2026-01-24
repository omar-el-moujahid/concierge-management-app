import React from "react";
import { Table, Badge } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import omar from "../../components/images/omar.jpg";

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // summaryMap : id_client -> { orders_count, total_spent }
  const [summary, setSummary] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // 1️⃣ récupérer les clients
        const clientsRes = await fetch("http://127.0.0.1:8000/clients");
        const clientsData = await clientsRes.json();

        // 2️⃣ récupérer summary (orders + total)
        const summaryRes = await fetch("http://127.0.0.1:8000/clients/summary");
        const summaryData = await summaryRes.json();

        // construire le map
        const summaryMap = {};
        if (Array.isArray(summaryData)) {
          summaryData.forEach(s => {
            summaryMap[s.id_client] = {
              orders_count: s.orders_count,
              total_spent: s.total_spent
            };
          });
        }

        setClients(Array.isArray(clientsData) ? clientsData : []);
        setSummary(summaryMap);

      } catch (error) {
        console.error(error);
        setClients([]);
        setSummary({});
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Table hover responsive className="bg-white rounded shadow-sm">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Nombre de commandes</th>
          <th>Total dépensé</th>
          <th>Contact</th>
          <th>Détails</th>
        </tr>
      </thead>

      <tbody>
        {clients.map(client => (
          <tr key={client.id_client}>
            {/* CUSTOMER */}
            <td>
              <div className="d-flex align-items-center gap-3">
                <img src={omar} className="rounded-circle" width="36" />
                <div>
                  <strong>
                    {client.prenom_client} {client.nom_client}
                  </strong>
                  <div className="text-muted small">
                    {client.contact?.email ?? "—"}
                  </div>
                </div>
              </div>
            </td>

            {/* ORDERS */}
            <td>
              {summary[client.id_client]?.orders_count ?? 0}
            </td>

            {/* TOTAL */}
            <td>
              {(summary[client.id_client]?.total_spent ?? 0).toFixed(2)} €
            </td>

            {/* CONTACT */}
            <td>
              {client.contact?.telephones?.[0]?.numero ?? "—"}
            </td>

            {/* DETAILS */}
            <td>
              <Badge
                bg="secondary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/clients/${client.id_client}`)}
              >
                View profile
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
