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
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import { ProductCategory } from '@prisma/client';
import { createGroceryItem } from '@/lib/dbCatalogActions';

// Google Custom Search API Configuration
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const GOOGLE_CX = process.env.NEXT_PUBLIC_GOOGLE_CX;

interface GoogleImageResult {
  link: string;
  image: {
    thumbnailLink: string;
    contextLink?: string;
  };
  title: string;
  displayLink?: string;
}

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

const getCategorySearchContext = (category: ProductCategory | ''): string => {
  if (!category) return 'grocery food product';

  const contextMap: Record<ProductCategory, string> = {
    [ProductCategory.Fruits]: 'fresh fruit produce',
    [ProductCategory.Vegetables]: 'fresh vegetable produce',
    [ProductCategory.CannedGoods]: 'canned food product',
    [ProductCategory.Dairy]: 'dairy product milk cheese',
    [ProductCategory.Meat]: 'meat protein butcher',
    [ProductCategory.FishSeafood]: 'fish seafood fresh',
    [ProductCategory.Deli]: 'deli meat cheese',
    [ProductCategory.Condiments]: 'condiment sauce grocery',
    [ProductCategory.Spices]: 'spice seasoning jar',
    [ProductCategory.Snacks]: 'snack food packaged',
    [ProductCategory.Bakery]: 'bakery bread fresh',
    [ProductCategory.Beverages]: 'beverage drink bottle',
    [ProductCategory.Pasta]: 'pasta noodles packaged',
    [ProductCategory.Grains]: 'grain rice packaged',
    [ProductCategory.Cereal]: 'cereal breakfast box',
    [ProductCategory.Baking]: 'baking ingredient grocery',
    [ProductCategory.FrozenFoods]: 'frozen food product',
    [ProductCategory.Other]: 'grocery food product',
  };

  return contextMap[category];
};

const storageOptions = ['Pantry', 'Refrigerator', 'Freezer', 'Counter', 'Cabinet', 'Other'];

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
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const [showImageSearch, setShowImageSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GoogleImageResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchAttempt, setSearchAttempt] = useState(0);

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
    setSelectedImageUrl(null);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const buildEnhancedQuery = (query: string, attempt: number = 0): string => {
    const categoryContext = getCategorySearchContext(formData.category);

    const exclusions =
      '-logo -icon -tech -electronics -company -corporation -brand -iphone -ipad -macbook -laptop -computer -app -software';

    const strategies = [
      `"${query}" ${categoryContext} ${exclusions}`,

      `${query} fresh grocery supermarket ${exclusions}`,

      `${query} walmart target costco product ${exclusions}`,

      `${query} packaged product food item ${exclusions}`,
    ];

    return strategies[attempt % strategies.length];
  };

  const searchGoogleImages = async (query: string, attemptOverride?: number) => {
    if (!query.trim()) return;

    setSearching(true);
    setSearchError(null);

    try {
      const currentAttempt = attemptOverride !== undefined ? attemptOverride : searchAttempt;
      const enhancedQuery = buildEnhancedQuery(query, currentAttempt);

      const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(
        enhancedQuery,
      )}&searchType=image&num=10&imgSize=medium&safe=active&imgType=photo&imgColorType=color&fileType=jpg,png`;

      console.log('Search attempt:', currentAttempt);
      console.log('Enhanced query:', enhancedQuery);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);

        if (response.status === 403) {
          throw new Error('API key issue. Please check your Google API key configuration.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          throw new Error(errorData.error?.message || 'Search failed');
        }
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        setSearchError(
          'No images found with this search strategy. Try clicking "Try Different Results" or entering a different term.',
        );
        setSearchResults([]);
      } else {
        setSearchResults(data.items);
        console.log('Found', data.items.length, 'images');
      }
    } catch (error: any) {
      console.error('Search error:', error);
      setSearchError(error.message || 'Image search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchAttempt(0);
    searchGoogleImages(searchQuery, 0);
  };

  const handleTryDifferentResults = () => {
    const nextAttempt = searchAttempt + 1;
    setSearchAttempt(nextAttempt);
    searchGoogleImages(searchQuery, nextAttempt);
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setImagePreview(imageUrl);
    setImageFile(null); // Clear any uploaded file
    setShowImageSearch(false); // Close modal
    setMessage({ type: 'success', text: '✓ Image selected from Google search!' });

    // Clear success message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  // Auto-populate search with item name
  useEffect(() => {
    if (formData.name) {
      setSearchQuery(formData.name);
    }
  }, [formData.name]);

  // Revoke object URL when component unmounts
  useEffect(
    () => () => {
      if (imagePreview && imageFile) {
        URL.revokeObjectURL(imagePreview);
      }
    },
    [imagePreview, imageFile],
  );

  const uploadImageToS3 = async (file: File): Promise<string | null> => {
    try {
      setUploadProgress('Getting upload URL...');

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
      let finalImageUrl: string | null = null;

      // Priority: Selected Google image URL > Uploaded file
      if (selectedImageUrl) {
        finalImageUrl = selectedImageUrl;
        console.log('Using Google image URL:', selectedImageUrl);
      } else if (imageFile) {
        try {
          finalImageUrl = await uploadImageToS3(imageFile);
          console.log('Uploaded to S3:', finalImageUrl);
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
        picture: finalImageUrl,
      });

      setMessage({ type: 'success', text: 'Grocery item created successfully! Redirecting...' });

      setFormData({
        name: '',
        storeName: '',
        category: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setSelectedImageUrl(null);

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
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className="fw-bold text-success mb-3">Add New Catalog Product</h1>
          </Col>
        </Row>

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
                    <Col>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold">Storage Location (Coming Soon)</Form.Label>
                        <Dropdown autoClose="inside">
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
                            Select storage location
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="w-100">
                            {storageOptions.map((option) => (
                              <Dropdown.Item key={option} disabled>
                                {option}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

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
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="text-center p-3">
                          <div className="display-1 text-muted mb-2">📷</div>
                          <p className="text-muted mb-0">No image selected</p>
                          <small className="text-muted">Click search or upload</small>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <Button
                      variant="success"
                      onClick={() => setShowImageSearch(true)}
                      disabled={loading || !formData.name}
                      className="fw-bold"
                      size="lg"
                    >
                      🔍 Search Google Images
                    </Button>

                    <div className="text-muted my-1">or</div>

                    <Button
                      variant={imagePreview ? 'outline-success' : 'success'}
                      onClick={() => document.getElementById('grocery-image')?.click()}
                      disabled={loading}
                      size="lg"
                    >
                      📤 Upload Image
                    </Button>

                    {imagePreview && (
                      <Button
                        variant="outline-danger"
                        onClick={() => {
                          setImageFile(null);
                          setSelectedImageUrl(null);
                          if (imagePreview && imageFile) {
                            URL.revokeObjectURL(imagePreview);
                          }
                          setImagePreview(null);
                          const input = document.getElementById('grocery-image') as HTMLInputElement | null;
                          if (input) input.value = '';
                        }}
                        disabled={loading}
                      >
                        🗑️ Remove Image
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

                  {!formData.name && (
                    <Alert variant="info" className="mt-3 mb-0 py-2">
                      <small>💡 Enter item name first to search</small>
                    </Alert>
                  )}

                  {!formData.category && formData.name && (
                    <Alert variant="warning" className="mt-3 mb-0 py-2">
                      <small>⚠️ Select category for better search results</small>
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

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

      {/* Google Image Search Modal */}
      <Modal show={showImageSearch} onHide={() => setShowImageSearch(false)} size="xl">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <span className="text-success">🔍</span> Google Image Search
            {formData.category && (
              <small className="text-muted ms-2">(Category: {getCategoryDisplayName(formData.category)})</small>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Form onSubmit={handleSearchSubmit} className="mb-4">
            <InputGroup size="lg">
              <Form.Control
                type="text"
                placeholder="Search for product images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={searching}
              />
              <Button variant="success" type="submit" disabled={searching || !searchQuery.trim()}>
                {searching ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </InputGroup>
            {!formData.category && (
              <small className="text-warning d-block mt-2">
                💡 Tip: Select a category first for more accurate results
              </small>
            )}
          </Form>

          {searchError && (
            <Alert variant="warning" className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span>{searchError}</span>
                <Button variant="outline-warning" size="sm" onClick={handleTryDifferentResults} disabled={searching}>
                  🔄 Try Different Results
                </Button>
              </div>
            </Alert>
          )}

          {searching && (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Searching...</span>
              </div>
              <p className="mt-3 text-muted">Searching Google Images...</p>
            </div>
          )}

          {!searching && searchResults.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Alert variant="success" className="mb-0 flex-grow-1 me-2">
                  <strong>✨ Click any image to select it!</strong> Found {searchResults.length} results.
                </Alert>
                <Button variant="outline-success" onClick={handleTryDifferentResults} disabled={searching}>
                  🔄 Try Different Results
                </Button>
              </div>
              <Row>
                {searchResults.map((result, index) => (
                  <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                    <div
                      onClick={() => handleImageClick(result.link)}
                      style={{
                        cursor: 'pointer',
                        border: '2px solid #dee2e6',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        position: 'relative',
                      }}
                      className="image-card"
                    >
                      <img
                        src={result.image.thumbnailLink}
                        alt={result.title}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23ddd" width="150" height="150"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="image-overlay">
                        <div className="select-badge">✓ Select</div>
                      </div>
                      {result.displayLink && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            padding: '4px 8px',
                            fontSize: '10px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {result.displayLink}
                        </div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </>
          )}

          {!searching && searchResults.length === 0 && !searchError && (
            <div className="text-center text-muted py-5">
              <div className="display-1 mb-3">🔍</div>
              <p className="mb-0">Enter a search term and click "Search"</p>
              <small>Enhanced search will use category context automatically</small>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <style jsx global>{`
        .image-card {
          position: relative;
        }

        .image-card:hover {
          border-color: #28a745 !important;
          box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
          transform: translateY(-4px);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(40, 167, 69, 0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          opacity: 0;
        }

        .image-card:hover .image-overlay {
          background: rgba(40, 167, 69, 0.85);
          opacity: 1;
        }

        .select-badge {
          background: white;
          color: #28a745;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default CreateGroceryItemForm;
