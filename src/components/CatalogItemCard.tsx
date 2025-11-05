import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import { ListUl } from 'react-bootstrap-icons';

interface CatalogItemCardProps {
  picture: string;
  catalogItemTitle: string;
  storeName: string;
  storageType: string;
  catalogItemType: string;
}

const CatalogItemCard = ({
  picture,
  catalogItemTitle,
  storeName,
  storageType,
  catalogItemType,
}: CatalogItemCardProps) => {
  const [isInList, setIsInList] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(0);
      setIsInList(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Placeholder function for handling add/remove button click
  const handleButtonClick = () => {
    setIsInList(true);
    setQuantity(1);
  };

  // Placeholder function for handling image error
  const handleImageError = () => {
    console.log('Image failed to load');
  };

  return (
    <div
      className="rounded-5 bg-success d-flex justify-content-center align-items-center px-2 py-2"
      style={{ width: '320px', height: '400px', transition: 'transform 0.3s ease' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
      }}
    >
      <Card className="rounded-5" style={{ width: '18rem', height: '380px' }}>
        <div
          style={{
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <Card.Img
            variant="top"
            src={picture}
            className="mx-auto d-block"
            onError={handleImageError}
            style={{
              width: '140px',
              height: '140px',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </div>

        <Card.Body className="d-flex flex-column">
          <div>
            <Card.Title>{catalogItemTitle}</Card.Title>

            <Row className="mb-2">
              <Col>
                <Card.Text className="mb-1">Store:</Card.Text>
                <Badge bg="secondary">{storeName}</Badge>
              </Col>
              <Col>
                <Card.Text className="mb-1">Storage:</Card.Text>
                <Badge bg="secondary">{storageType}</Badge>
              </Col>
              <Col>
                <Card.Text className="mb-1">Type:</Card.Text>
                <Badge bg="secondary">{catalogItemType}</Badge>
              </Col>
            </Row>
          </div>

          <Row className="mt-auto px-3">
            {!isInList ? (
              <Button variant="success" onClick={handleButtonClick}>
                Add to list
              </Button>
            ) : (
              <div className="bg-light rounded p-2 w-100">
                <Row className="justify-content-center align-items-center">
                  <Col xs="auto">
                    <ListUl size={24} className="text-secondary" />
                  </Col>
                  <Col xs="auto">
                    <div 
                      className="d-flex align-items-center rounded-pill overflow-hidden" 
                      style={{ border: '2px solid #adb5bd' }}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={decreaseQuantity}
                        className="border-0 px-3 rounded-0 py-2"
                        style={{ fontWeight: '900', fontSize: '1.2rem' }}
                      >
                        −
                      </Button>
                      <div 
                        className="px-3 fw-bold border-start border-end d-flex align-items-center" 
                        style={{ 
                          minWidth: '45px', 
                          textAlign: 'center', 
                          borderColor: '#adb5bd !important',
                          minHeight: '42px'
                        }}
                      >
                        {quantity}
                      </div>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={increaseQuantity}
                        className="border-0 px-3 rounded-0 py-2"
                        style={{ fontWeight: '900', fontSize: '1.2rem' }}
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CatalogItemCard;
