import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface ProductCardProps {
  productImage: string;
  productTitle: string;
  store: string;
  storageType: string;
  productType: string;
  inList: boolean;
}

const ProductCard = ({ productImage, productTitle, store, storageType, productType, inList }: ProductCardProps) => {
  // Placeholder function for handling add/remove button click
  const handleButtonClick = () => {
    console.log(`${inList ? 'Removing' : 'Adding'} ${productTitle} ${inList ? 'from' : 'to'} list`);
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
          src={productImage}
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
          <Card.Title>{productTitle}</Card.Title>

          <Row className="mb-2">
            <Col>
              <Card.Text className="mb-1">Store:</Card.Text>
              <Badge bg="secondary">{store}</Badge>
            </Col>
            <Col>
              <Card.Text className="mb-1">Storage:</Card.Text>
              <Badge bg="secondary">{storageType}</Badge>
            </Col>
            <Col>
              <Card.Text className="mb-1">Type:</Card.Text>
              <Badge bg="secondary">{productType}</Badge>
            </Col>
          </Row>

          <Row className="px-3">
            <Button variant={inList ? 'danger' : 'success'} onClick={handleButtonClick}>
              {inList ? 'Remove' : 'Add'}
            </Button>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductCard;
