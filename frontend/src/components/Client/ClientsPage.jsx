import React from "react";

import { Container, Row, Col } from "react-bootstrap";
import ClientsFilter from "./ClientFilter";
import ClientsTable from "./ClientsTable";


export default function ClientsPage() {
    
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
