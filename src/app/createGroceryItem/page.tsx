// 'use client';

// import React from 'react';
// import Container from 'react-bootstrap/Container';

// const CreateGroceryItemForm = () => {
//   return (
//     <Container fluid className="p-5">
//       <h1>Create a Grocery Item </h1>
//     </Container>
//   );
// };

// export default CreateGroceryItemForm;

'use client';

import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CreateGroceryItemForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    soldAt: '',
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <Container fluid className="p-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="mb-4">Create a Grocery Item</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Grocery Item Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter grocery item name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Store</Form.Label>
              <Form.Control
                type="text"
                name="soldAt"
                value={formData.soldAt}
                onChange={handleChange}
                placeholder="Enter store name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category</option>
                <option value="produce">Produce</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="bakery">Bakery</option>
                <option value="pantry">Pantry</option>
                <option value="frozen">Frozen</option>
                <option value="beverages">Beverages</option>
                <option value="snacks">Snacks</option>
                <option value="household">Household</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg">
                Create Grocery Item
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateGroceryItemForm;
