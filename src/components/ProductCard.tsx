import Card from 'react-bootstrap/Card';
import { Product } from '@prisma/client';
import Link from 'next/link';

interface ProductCardProps {
  product: Product | undefined;
}

const ProductCard = ({
  product,
}: ProductCardProps) => (
  <div
    className="rounded-5 bg-success d-flex justify-content-center align-items-center px-2 py-2"
    style={{ width: '320px', height: '350px', transition: 'transform 0.3s ease' }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-10px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0px)';
    }}
  >
    <Card className="rounded-5" style={{ width: '18rem' }}>
      <Card.Header className="text-center bg-white border-0">
        <Card.Img
          variant="top"
          src={product?.picture?.toString() || '/images/logo.svg'}
          className="mx-auto d-block"
          style={{
            maxWidth: '150px',
            maxHeight: '150px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
        <Card.Title><Link href={`/product/${product?.id}`}>{product?.name}</Link></Card.Title>
      </Card.Header>
    </Card>
  </div>
);

export default ProductCard;
