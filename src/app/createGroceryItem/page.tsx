// 'use client';

// import React, { ChangeEvent, useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Alert from 'react-bootstrap/Alert';
// import { ProductCategory } from '@prisma/client';
// import { createGroceryItem } from '@/lib/dbCatalogActions';

// // Helper function to get display name for category
// const getCategoryDisplayName = (category: ProductCategory): string => {
//   const displayNames: Record<ProductCategory, string> = {
//     [ProductCategory.Fruits]: 'Fruits',
//     [ProductCategory.Vegetables]: 'Vegetables',
//     [ProductCategory.CannedGoods]: 'Canned Goods',
//     [ProductCategory.Dairy]: 'Dairy',
//     [ProductCategory.Meat]: 'Meat',
//     [ProductCategory.FishSeafood]: 'Fish & Seafood',
//     [ProductCategory.Deli]: 'Deli',
//     [ProductCategory.Condiments]: 'Condiments',
//     [ProductCategory.Spices]: 'Spices',
//     [ProductCategory.Snacks]: 'Snacks',
//     [ProductCategory.Bakery]: 'Bakery',
//     [ProductCategory.Beverages]: 'Beverages',
//     [ProductCategory.Pasta]: 'Pasta',
//     [ProductCategory.Grains]: 'Grains',
//     [ProductCategory.Cereal]: 'Cereal',
//     [ProductCategory.Baking]: 'Baking',
//     [ProductCategory.FrozenFoods]: 'Frozen Foods',
//     [ProductCategory.Other]: 'Other',
//   };
//   return displayNames[category];
// };

// const CreateGroceryItemForm = () => {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     name: '',
//     storeName: '',
//     category: '' as ProductCategory | '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState<string | null>(null);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<any>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     setImageFile(file);
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setImagePreview(url);
//     } else {
//       setImagePreview(null);
//     }
//   };

//   // Revoke object URL when component unmounts or imageFile changes
//   useEffect(
//     () => () => {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//     },
//     [imagePreview],
//   );

//   const uploadImageToS3 = async (file: File): Promise<string | null> => {
//     try {
//       setUploadProgress('Getting upload URL...');

//       // Get presigned URL from your API
//       const presignResponse = await fetch('/api/catalog/image-upload', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           fileName: file.name,
//           fileType: file.type,
//         }),
//       });

//       if (!presignResponse.ok) {
//         const error = await presignResponse.json();
//         throw new Error(error.error || 'Failed to get upload URL');
//       }

//       const { url, fields, fileUrl } = await presignResponse.json();

//       setUploadProgress('Uploading to S3...');

//       // Upload file to S3 using presigned POST
//       const uploadFormData = new FormData();
//       Object.entries(fields).forEach(([key, value]) => {
//         uploadFormData.append(key, value as string);
//       });
//       uploadFormData.append('file', file);

//       const uploadResponse = await fetch(url, {
//         method: 'POST',
//         body: uploadFormData,
//       });

//       if (!uploadResponse.ok) {
//         throw new Error('Failed to upload image to S3');
//       }

//       setUploadProgress('Upload complete!');
//       return fileUrl;
//     } catch (error) {
//       console.error('Image upload error:', error);
//       setUploadProgress(null);
//       throw error;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name || !formData.category || !formData.storeName) {
//       setMessage({ type: 'error', text: 'Please fill in all required fields.' });
//       return;
//     }

//     if (!session?.user) {
//       setMessage({ type: 'error', text: 'You must be logged in to create items.' });
//       return;
//     }

//     // Get user ID from session - could be id, sub, or other field depending on auth setup
//     console.log('Full session object:', JSON.stringify(session, null, 2));
//     const userId = session.user.id || (session.user as any).sub || session.user.email;
//     console.log('Determined userId:', userId);

//     if (!userId) {
//       setMessage({ type: 'error', text: 'Unable to identify user. Please try logging out and back in.' });
//       console.error('Session user object:', session.user);
//       return;
//     }

//     console.log('Creating item for user:', userId);

//     setLoading(true);
//     setMessage(null);
//     setUploadProgress(null);

//     try {
//       let imageUrl: string | null = null;

//       // Upload image if provided
//       if (imageFile) {
//         try {
//           imageUrl = await uploadImageToS3(imageFile);
//         } catch (uploadError) {
//           console.error('Image upload failed:', uploadError);
//           setMessage({
//             type: 'error',
//             text: 'Image upload failed. Please try again or create item without image.',
//           });
//           setLoading(false);
//           setUploadProgress(null);
//           return;
//         }
//       }

//       setUploadProgress('Creating grocery item...');

//       await createGroceryItem({
//         name: formData.name,
//         category: formData.category as ProductCategory,
//         storeName: formData.storeName,
//         userId, // Use the userId we determined above
//         picture: imageUrl,
//       });

//       setMessage({ type: 'success', text: 'Grocery item created successfully! Redirecting...' });

//       // Reset form
//       setFormData({
//         name: '',
//         storeName: '',
//         category: '',
//       });
//       setImageFile(null);
//       setImagePreview(null);

//       setTimeout(() => {
//         router.push('/catalog');
//       }, 1500);
//     } catch (error) {
//       console.error('Error creating grocery item:', error);
//       setMessage({ type: 'error', text: 'Failed to create grocery item. Please try again.' });
//     } finally {
//       setLoading(false);
//       setUploadProgress(null);
//     }
//   };

//   return (
//     <Container fluid className="p-5">
//       <Row className="justify-content-center">
//         <Col md={8} lg={6}>
//           <h1 className="mb-4">Create a Grocery Item</h1>

//           {message && <Alert variant={message.type === 'success' ? 'success' : 'danger'}>{message.text}</Alert>}

//           {uploadProgress && <Alert variant="info">{uploadProgress}</Alert>}

//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Grocery Item Name *</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter grocery item name"
//                 required
//                 disabled={loading}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Store *</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="storeName"
//                 value={formData.storeName}
//                 onChange={handleChange}
//                 placeholder="Enter store name"
//                 required
//                 disabled={loading}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Category *</Form.Label>
//               <Form.Select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select a category</option>
//                 {Object.values(ProductCategory).map((category) => (
//                   <option key={category} value={category}>
//                     {getCategoryDisplayName(category)}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Upload Image (optional)</Form.Label>

//               <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//                 <div
//                   style={{
//                     width: 120,
//                     height: 120,
//                     border: '1px solid #ddd',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     overflow: 'hidden',
//                     borderRadius: 6,
//                   }}
//                 >
//                   {imagePreview ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                     />
//                   ) : (
//                     <div style={{ textAlign: 'center', color: '#666', fontSize: 12 }}>No image</div>
//                   )}
//                 </div>

//                 <div>
//                   <Button
//                     variant="secondary"
//                     onClick={() => document.getElementById('grocery-image')?.click()}
//                     disabled={loading}
//                   >
//                     Choose Image
//                   </Button>
//                   <Button
//                     variant="link"
//                     onClick={() => {
//                       setImageFile(null);
//                       if (imagePreview) {
//                         URL.revokeObjectURL(imagePreview);
//                         setImagePreview(null);
//                       }
//                       const input = document.getElementById('grocery-image') as HTMLInputElement | null;
//                       if (input) input.value = '';
//                     }}
//                     disabled={!imagePreview || loading}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//               </div>

//               <Form.Control
//                 id="grocery-image"
//                 name="image"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 style={{ display: 'none' }}
//                 disabled={loading}
//               />
//             </Form.Group>

//             <div className="d-grid gap-2">
//               <Button variant="success" type="submit" size="lg" disabled={loading}>
//                 {loading ? 'Creating...' : 'Create Grocery Item'}
//               </Button>

//               <Button
//                 variant="outline-secondary"
//                 type="button"
//                 size="lg"
//                 disabled={loading}
//                 onClick={() => router.push('/catalog')}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default CreateGroceryItemForm;

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
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import { ProductCategory } from '@prisma/client';
import { createGroceryItem } from '@/lib/dbCatalogActions';

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
    storeName: '',
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

  const uploadImageToS3 = async (file: File): Promise<string | null> => {
    try {
      setUploadProgress('Getting upload URL...');

      // Get presigned URL from your API
      const presignResponse = await fetch('/api/catalog/image-upload', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.storeName) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    if (!session?.user) {
      setMessage({ type: 'error', text: 'You must be logged in to create items.' });
      return;
    }

    const userId = session.user.id || (session.user as any).sub || session.user.email;

    if (!userId) {
      setMessage({ type: 'error', text: 'Unable to identify user. Please try logging out and back in.' });
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
        storeName: formData.storeName,
        userId,
        picture: imageUrl,
      });

      setMessage({ type: 'success', text: 'Grocery item created successfully! Redirecting...' });

      // Reset form
      setFormData({
        name: '',
        storeName: '',
        category: '',
      });
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => {
        router.push('/catalog');
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
    <div style={{ backgroundColor: '#f0f8f0', minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        {/* Header Section */}
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className=" fw-bold text-success mb-3">Add New Catalog Product</h1>
          </Col>
        </Row>

        {/* Alert Messages */}
        {message && (
          <Row className="mb-4">
            <Col>
              <Alert variant={message.type === 'success' ? 'success' : 'danger'} className="text-center">
                {message.text}
              </Alert>
            </Col>
          </Row>
        )}
        {message?.type === 'success' && message.text.includes('Redirecting') && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
            }}
          >
            <div className="spinner-border text-success" role="status" style={{ width: '4rem', height: '4rem' }}>
              <span className="visually-hidden">Redirecting...</span>
            </div>
            <div className="mt-3 text-success fw-bold fs-5">Redirecting...</div>
          </div>
        )}
        {uploadProgress && (
          <Row className="mb-4">
            <Col>
              <Alert variant="info" className="text-center">
                {uploadProgress}
              </Alert>
            </Col>
          </Row>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Left Column - Form Fields */}
            <Col lg={8}>
              <Card className="shadow-sm mb-4" style={{ borderTop: '4px solid #28a745' }}>
                <Card.Header style={{ backgroundColor: '#d4edda', borderBottom: '1px solid #c3e6cb' }}>
                  <h5 className="mb-0 text-success fw-bold">Item Details</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Grocery Item Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Organic Bananas"
                          required
                          disabled={loading}
                          size="lg"
                          className="border-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Store *</Form.Label>
                        <Form.Control
                          type="text"
                          name="storeName"
                          value={formData.storeName}
                          onChange={handleChange}
                          placeholder="Enter store name (e.g., Walmart, Target, etc.)"
                          required
                          disabled={loading}
                          size="lg"
                          className="border-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Category *</Form.Label>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="light"
                            size="lg"
                            className="w-100 text-start"
                            disabled={loading}
                            style={{
                              height: '48px',
                              border: '2px solid #dee2e6',
                              backgroundColor: 'white',
                            }}
                          >
                            {formData.category ? getCategoryDisplayName(formData.category) : 'Select a category'}
                          </Dropdown.Toggle>
                          <Dropdown.Menu
                            className="w-100"
                            style={{
                              maxHeight: '300px',
                              overflowY: 'auto',
                            }}
                          >
                            {Object.values(ProductCategory).map((category) => (
                              <Dropdown.Item
                                key={category}
                                onClick={() => setFormData((prev) => ({ ...prev, category }))}
                                active={formData.category === category}
                              >
                                {getCategoryDisplayName(category)}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                        <input type="hidden" name="category" value={formData.category} required />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column - Image Upload */}
            <Col lg={4}>
              <Card className="shadow-sm mb-4" style={{ borderTop: '4px solid #28a745' }}>
                <Card.Header style={{ backgroundColor: '#d4edda', borderBottom: '1px solid #c3e6cb' }}>
                  <h5 className="mb-0 text-success fw-bold">Product Image</h5>
                </Card.Header>
                <Card.Body className="text-center p-4">
                  <div className="mb-3">
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        border: '3px dashed #a8d5a8',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        backgroundColor: '#f8fff8',
                        marginBottom: '1rem',
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
                        <div className="text-center p-3">
                          <div className="display-1 text-muted mb-2">📷</div>
                          <p className="text-muted mb-0">No image selected</p>
                          <small className="text-muted">PNG, JPG up to 10MB</small>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <Button
                      variant={imagePreview ? 'outline-success' : 'success'}
                      onClick={() => document.getElementById('grocery-image')?.click()}
                      disabled={loading}
                    >
                      {imagePreview ? 'Change Image' : 'Choose Image'}
                    </Button>

                    {imagePreview && (
                      <Button
                        variant="outline-danger"
                        onClick={() => {
                          setImageFile(null);
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview);
                            setImagePreview(null);
                          }
                          const input = document.getElementById('grocery-image') as HTMLInputElement | null;
                          if (input) input.value = '';
                        }}
                        disabled={loading}
                      >
                        Remove Image
                      </Button>
                    )}
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
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Action Buttons Row */}
          <Row>
            <Col>
              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  size="lg"
                  disabled={loading}
                  onClick={() => router.push('/catalog')}
                >
                  Cancel
                </Button>
                <Button variant="success" type="submit" size="lg" disabled={loading} className="px-5">
                  {loading ? 'Creating...' : 'Create Item'}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};

export default CreateGroceryItemForm;
