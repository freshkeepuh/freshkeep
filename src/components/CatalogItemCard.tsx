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
  inList: boolean;
}

const CatalogItemCard = ({
  picture,
  catalogItemTitle,
  storeName,
  storageType,
  catalogItemType,
  inList,
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
      style={{ width: '320px', height: '350x', transition: 'transform 0.3s ease' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-10px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
      }}
    >
      <Card className="rounded-5" style={{ width: '18rem' }}>
        <Card.Img
          variant="top"
          src={picture}
          className="mx-auto d-block"
          onError={handleImageError}
          style={{
            maxWidth: '150px',
            maxHeight: '150px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        <Card.Body>
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

          <Row className="px-3">
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
                    <div className="d-flex align-items-center">
                      <Button variant="outline-danger" size="sm" onClick={decreaseQuantity}>
                        -
                      </Button>
                      <div className="px-3 fw-bold">{quantity}</div>
                      <Button variant="outline-success" size="sm" onClick={increaseQuantity}>
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
