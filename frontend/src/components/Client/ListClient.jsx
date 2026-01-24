import React from "react";
import { useEffect , useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ClientsFilter from "../components/ClientsFilter";
import ClientsTable from "../components/ClientsTable";

export default function ListClient() {
const [client , setClients] = useState([]);
useEffect(() => {
    async function fetchclients() {
    try {
         const response = await fetch("http://127.0.0.1:8000/clients");
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
        console.log("Failed to fetch clients");
        }
      const data = await response.json();
      setClients(data);

      console.log(data);
    } catch (error) {
        console.error("Error fetching profile data:", error);

      }
    }
    fetchclients();
    }, []);

  return (
    <Container fluid>
      <Row>
        {/* SUB NAV */}
        <Col md={3} lg={2} className="bg-white border-end min-vh-100 p-3">
          <ClientsFilter />
        </Col>

        {/* TABLE */}
        <Col md={9} lg={10} className="p-4 bg-light">
          <ClientsTable />
        </Col>
      </Row>
    </Container>
  );
}
