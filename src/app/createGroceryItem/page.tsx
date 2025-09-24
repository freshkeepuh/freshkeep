'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { GroceryCategory } from '@prisma/client';
import { createGroceryItem } from '@/lib/dbShopActions';

// Helper function to get display name for category
const getCategoryDisplayName = (category: GroceryCategory): string => {
  const displayNames: Record<GroceryCategory, string> = {
    [GroceryCategory.Fruits]: 'Fruits',
    [GroceryCategory.Vegetables]: 'Vegetables',
    [GroceryCategory.CannedGoods]: 'Canned Goods',
    [GroceryCategory.Dairy]: 'Dairy',
    [GroceryCategory.Meat]: 'Meat',
    [GroceryCategory.FishSeafood]: 'Fish & Seafood',
    [GroceryCategory.Deli]: 'Deli',
    [GroceryCategory.Condiments]: 'Condiments',
    [GroceryCategory.Spices]: 'Spices',
    [GroceryCategory.Snacks]: 'Snacks',
    [GroceryCategory.Bakery]: 'Bakery',
    [GroceryCategory.Beverages]: 'Beverages',
    [GroceryCategory.Pasta]: 'Pasta',
    [GroceryCategory.Grains]: 'Grains',
    [GroceryCategory.Cereal]: 'Cereal',
    [GroceryCategory.Baking]: 'Baking',
    [GroceryCategory.FrozenFoods]: 'Frozen Foods',
    [GroceryCategory.Other]: 'Other',
  };
  return displayNames[category];
};

const CreateGroceryItemForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    soldAt: '',
    category: '' as GroceryCategory | '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.soldAt) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    if (!session?.user?.email) {
      setMessage({ type: 'error', text: 'You must be logged in to create items.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await createGroceryItem({
        name: formData.name,
        category: formData.category as GroceryCategory,
        soldAt: formData.soldAt,
        userId: session.user.email, // Pass the current user's email as userId
      });

      setMessage({ type: 'success', text: 'Grocery item created successfully! Redirecting...' });

      // Reset form
      setFormData({
        name: '',
        soldAt: '',
        category: '',
      });

      // Redirect to shop page after a short delay to show success message
      setTimeout(() => {
        router.push('/shop');
      }, 1500);
    } catch (error) {
      console.error('Error creating grocery item:', error);
      setMessage({ type: 'error', text: 'Failed to create grocery item. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="mb-4">Create a Grocery Item</h1>

          {message && <Alert variant={message.type === 'success' ? 'success' : 'danger'}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Grocery Item Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter grocery item name"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Store *</Form.Label>
              <Form.Control
                type="text"
                name="soldAt"
                value={formData.soldAt}
                onChange={handleChange}
                placeholder="Enter store name"
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select a category</option>
                {Object.values(GroceryCategory).map((category) => (
                  <option key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="success" type="submit" size="lg" disabled={loading}>
                {loading ? 'Creating...' : 'Create Grocery Item'}
              </Button>

              <Button
                variant="outline-secondary"
                type="button"
                size="lg"
                disabled={loading}
                onClick={() => router.push('/shop')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateGroceryItemForm;
