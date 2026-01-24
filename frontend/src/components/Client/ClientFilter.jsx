import React, { useEffect , useState } from "react";

import { Form } from "react-bootstrap";

export default function ClientsFilter() {
  return (
    <>
      <Form.Control
        type="text"
        placeholder="Search"
        className="mb-4"
      />

      <h6 className="text-muted">LAST VISITED</h6>
      <Form.Check label="Today" />
      <Form.Check label="This week" />
      <Form.Check label="Last month" />

      <hr />

      <h6 className="text-muted">HAS ORDERED</h6>
      <Form.Check label="Yes" />
      <Form.Check label="No" />

      <hr />

      <h6 className="text-muted">NEWSLETTER</h6>
      <Form.Check label="Yes" />
      <Form.Check label="No" />
    </>
  );
}
