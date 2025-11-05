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
  const [inputValue, setInputValue] = useState('1');

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
    } else {
      setQuantity(0);
      setInputValue('0');
      setIsInList(false);
    }
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setInputValue(newQuantity.toString());
  };

  // Placeholder function for handling add/remove button click
  const handleButtonClick = () => {
    setIsInList(true);
    setQuantity(1);
    setInputValue('1');
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
              <Button variant="success" onClick={handleButtonClick} style={{ height: '46px' }}>
                Add to list
              </Button>
            ) : (
              <div className="rounded w-100" style={{ height: '46px' }}>
                <Row className="justify-content-center align-items-center h-100">
                  <Col xs="auto">
                    <Button
                      variant="link"
                      href="/shoppingList"
                      className="p-0"
                      style={{ color: 'var(--bs-secondary)' }}
                    >
                      <ListUl size={24} />
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <div
                      className="d-flex align-items-center rounded-pill overflow-hidden h-100"
                      style={{ border: '2px solid #adb5bd' }}
                    >
                      <Button
                        variant="light"
                        size="sm"
                        onClick={decreaseQuantity}
                        className="border-0 px-3 rounded-0 py-2 fw-bold"
                        style={{
                          fontSize: '1.2rem',
                          color: 'var(--bs-danger)',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.backgroundColor = 'var(--bs-danger)')}
                        onMouseUp={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bs-light)';
                          e.currentTarget.style.color = 'var(--bs-danger)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bs-light)';
                          e.currentTarget.style.color = 'var(--bs-danger)';
                        }}
                      >
                        −
                      </Button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={inputValue}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/[^0-9]/g, '');
                          setInputValue(newValue);
                          const val = parseInt(newValue, 10);
                          if (Number.isFinite(val)) {
                            if (val > 0) {
                              setQuantity(val);
                            } else {
                              setQuantity(0);
                              setIsInList(false);
                            }
                          }
                        }}
                        onBlur={() => {
                          // If empty or invalid, revert to previous quantity
                          const val = parseInt(inputValue, 10);
                          if (!Number.isFinite(val) || val <= 0) {
                            setInputValue(quantity.toString());
                          }
                        }}
                        className="px-3 fw-bold bg-white border-0 text-center quantity-input"
                        style={{
                          width: '60px',
                          minHeight: '42px',
                          WebkitAppearance: 'none',
                          MozAppearance: 'textfield',
                        }}
                      />
                      <Button
                        variant="light"
                        size="sm"
                        onClick={increaseQuantity}
                        className="border-0 px-3 rounded-0 py-2 fw-bold"
                        style={{
                          fontSize: '1.2rem',
                          color: 'var(--bs-success)',
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bs-success)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bs-light)';
                          e.currentTarget.style.color = 'var(--bs-success)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bs-light)';
                          e.currentTarget.style.color = 'var(--bs-success)';
                        }}
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
