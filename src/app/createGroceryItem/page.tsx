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

enum GroceryCategory {
  PRODUCE = 'produce',
  DAIRY = 'dairy',
  MEAT = 'meat',
  BAKERY = 'bakery',
  PANTRY = 'pantry',
  FROZEN = 'frozen',
  BEVERAGES = 'beverages',
  SNACKS = 'snacks',
  HOUSEHOLD = 'household',
  OTHER = 'other',
}

// Helper function to get display name for category
const getCategoryDisplayName = (category: GroceryCategory): string => {
  const displayNames: Record<GroceryCategory, string> = {
    [GroceryCategory.PRODUCE]: 'Produce',
    [GroceryCategory.DAIRY]: 'Dairy',
    [GroceryCategory.MEAT]: 'Meat',
    [GroceryCategory.BAKERY]: 'Bakery',
    [GroceryCategory.PANTRY]: 'Pantry',
    [GroceryCategory.FROZEN]: 'Frozen',
    [GroceryCategory.BEVERAGES]: 'Beverages',
    [GroceryCategory.SNACKS]: 'Snacks',
    [GroceryCategory.HOUSEHOLD]: 'Household',
    [GroceryCategory.OTHER]: 'Other',
  };
  return displayNames[category];
};

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
                {Object.values(GroceryCategory).map((category) => (
                  <option key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="success" type="submit" size="lg">
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
