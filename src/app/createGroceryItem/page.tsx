'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { ProductCategory } from '@prisma/client';
import { createGroceryItem } from '@/lib/dbShopActions';

// Helper function to get display name for category
const getCategoryDisplayName = (category: ProductCategory): string => {
  const displayNames: Record<ProductCategory, string> = {
    [ProductCategory.Fruits]: 'Fruits',
    [ProductCategory.Vegetables]: 'Vegetables',
    [ProductCategory.CannedGoods]: 'Canned Goods',
    [ProductCategory.Dairy]: 'Dairy',
    [ProductCategory.Meat]: 'Meat',
    [ProductCategory.FishSeafood]: 'Fish & Seafood',
    [ProductCategory.Deli]: 'Deli',
    [ProductCategory.Condiments]: 'Condiments',
    [ProductCategory.Spices]: 'Spices',
    [ProductCategory.Snacks]: 'Snacks',
    [ProductCategory.Bakery]: 'Bakery',
    [ProductCategory.Beverages]: 'Beverages',
    [ProductCategory.Pasta]: 'Pasta',
    [ProductCategory.Grains]: 'Grains',
    [ProductCategory.Cereal]: 'Cereal',
    [ProductCategory.Baking]: 'Baking',
    [ProductCategory.FrozenFoods]: 'Frozen Foods',
    [ProductCategory.Other]: 'Other',
  };
  return displayNames[category];
};

const CreateGroceryItemForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    soldAt: '',
    category: '' as ProductCategory | '',
  });

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // Revoke object URL when component unmounts or imageFile changes
  useEffect(
    () => () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    },
    [imagePreview],
  );

  //   try {
  //     setUploadProgress('Getting upload URL...');

  //     // Get presigned URL from your API
  //     const presignResponse = await fetch('/api/shop/image-upload', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         fileName: file.name,
  //         fileType: file.type,
  //       }),
  //     });

  //     if (!presignResponse.ok) {
  //       const error = await presignResponse.json();
  //       throw new Error(error.error || 'Failed to get upload URL');
  //     }

  //     const { url, fields, fileUrl } = await presignResponse.json();

  //     setUploadProgress('Uploading to S3...');

  //     // Upload file to S3 using presigned POST
  //     const formData = new FormData();
  //     Object.entries(fields).forEach(([key, value]) => {
  //       formData.append(key, value as string);
  // ...existing code...
  const uploadImageToS3 = async (file: File): Promise<string | null> => {
    try {
      setUploadProgress('Getting upload URL...');

      // Get presigned URL from your API
      const presignResponse = await fetch('/api/shop/image-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!presignResponse.ok) {
        const error = await presignResponse.json();
        throw new Error(error.error || 'Failed to get upload URL');
      }

      const { url, fields, fileUrl } = await presignResponse.json();

      setUploadProgress('Uploading to S3...');

      // Upload file to S3 using presigned POST
      const uploadFormData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        uploadFormData.append(key, value as string);
      });
      uploadFormData.append('file', file);

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to S3');
      }

      setUploadProgress('Upload complete!');
      return fileUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      setUploadProgress(null);
      throw error;
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.name || !formData.category || !formData.soldAt) {
  //     setMessage({ type: 'error', text: 'Please fill in all required fields.' });
  //     return;
  //   }

  //   if (!session?.user?.email) {
  //     setMessage({ type: 'error', text: 'You must be logged in to create items.' });
  //     return;
  //   }

  //   setLoading(true);
  //   setMessage(null);
  //   setUploadProgress(null);

  //   try {
  //     let imageUrl: string | null = null;

  //     // Upload image if provided
  //     if (imageFile) {
  //       try {
  //         imageUrl = await uploadImageToS3(imageFile);
  //       } catch (uploadError) {
  //         console.error('Image upload failed:', uploadError);
  //         setMessage({
  //           type: 'error',
  //           text: 'Image upload failed. Please try again or create item without image.',
  //         });
  //         setLoading(false);
  //         setUploadProgress(null);
  //         return;
  //       }
  //     }

  //     setUploadProgress('Creating grocery item...');

  //     // Create grocery item with optional image URL
  //     await createGroceryItem({
  //       name: formData.name,
  //       category: formData.category as ProductCategory,
  //       // soldAt: formData.soldAt,
  //       userId: session.user.email, // Pass the current user's email as userId
  //     });

  //     setMessage({ type: 'success', text: 'Grocery item created successfully! Redirecting...' });

  //     // Reset form
  //     setFormData({
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
    setUploadProgress(null);

    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (imageFile) {
        try {
          imageUrl = await uploadImageToS3(imageFile);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setMessage({
            type: 'error',
            text: 'Image upload failed. Please try again or create item without image.',
          });
          setLoading(false);
          setUploadProgress(null);
          return;
        }
      }

      setUploadProgress('Creating grocery item...');

      await createGroceryItem({
        name: formData.name,
        category: formData.category as ProductCategory,
        // soldAt: formData.soldAt,
        userId: session.user.email,
        picture: imageUrl,
      });

      setMessage({ type: 'success', text: 'Grocery item created successfully! Redirecting...' });

      // Reset form
      setFormData({
        name: '',
        soldAt: '',
        category: '',
      });
      setImageFile(null);
      setImagePreview(null);

      // Redirect to shop page after a short delay
      setTimeout(() => {
        router.push('/shop');
      }, 1500);
    } catch (error) {
      console.error('Error creating grocery item:', error);
      setMessage({ type: 'error', text: 'Failed to create grocery item. Please try again.' });
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };

  return (
    <Container fluid className="p-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="mb-4">Create a Grocery Item</h1>

          {message && <Alert variant={message.type === 'success' ? 'success' : 'danger'}>{message.text}</Alert>}

          {uploadProgress && <Alert variant="info">{uploadProgress}</Alert>}

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
                {Object.values(ProductCategory).map((category) => (
                  <option key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image (optional)</Form.Label>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: 6,
                  }}
                >
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#666', fontSize: 12 }}>No image</div>
                  )}
                </div>

                <div>
                  <Button
                    variant="secondary"
                    onClick={() => document.getElementById('grocery-image')?.click()}
                    disabled={loading}
                  >
                    Choose Image
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => {
                      setImageFile(null);
                      if (imagePreview) {
                        URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                      }
                      const input = document.getElementById('grocery-image') as HTMLInputElement | null;
                      if (input) input.value = '';
                    }}
                    disabled={!imagePreview || loading}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <Form.Control
                id="grocery-image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                disabled={loading}
              />
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
