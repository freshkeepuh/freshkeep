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
  <Card style={{ width: '18rem' }}>
    <Card.Img variant="top" src={productImage} />
    <Card.Body>
      <Card.Title>{productTitle}</Card.Title>

      <Row className="mb-2">
        <Col>
          <Card.Text className="mb-1">Store:</Card.Text>
          <Badge bg="secondary">{store}</Badge>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col>
          <Card.Text className="mb-1">Storage:</Card.Text>
          <Badge bg="secondary">{storageType}</Badge>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Card.Text className="mb-1">Type:</Card.Text>
          <Badge bg="secondary">{productType}</Badge>
        </Col>
      </Row>

      <Button variant={inList ? 'danger' : 'success'}>{inList ? 'Remove' : 'Add'}</Button>
    </Card.Body>
  </Card>;
};

export default ProductCard;
