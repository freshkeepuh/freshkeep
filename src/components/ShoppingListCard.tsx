import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

interface ShoppingListCardProps {
  listTitle: string;
  items: string[];
  onEdit: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

function ShoppingListCard({ listTitle, items, onEdit, onDelete, isDeleting }: ShoppingListCardProps) {
  return (
    <div
      style={{
        width: '320px',
        height: '400px',
      }}
    >
      <Card
        style={{
          backgroundColor: 'rgba(154, 205, 135, 0.4)',
          borderRadius: '20px',
          border: 'none',
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        }}
      >
        <Card.Header
          className="bg-success text-center"
          style={{
            borderRadius: '20px 20px 0 0',
            fontWeight: '500',
          }}
        >
          {listTitle}
        </Card.Header>
        <Card.Body>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '0',
              marginBottom: '15px',
              maxHeight: '260px',
              overflowY: 'auto',
            }}
          >
            <ListGroup variant="flush">
              {items.map((item, index) => {
                let borderRadius = '0';
                if (items.length === 1) {
                  borderRadius = '15px';
                } else if (index === 0) {
                  borderRadius = '15px 15px 0 0';
                } else if (index === items.length - 1) {
                  borderRadius = '0 0 15px 15px';
                }

                return (
                  <ListGroup.Item
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${item}-${index}`}
                    style={{ borderRadius }}
                  >
                    {item}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </div>
          <Button
            variant="light"
            onClick={onEdit}
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              width: '100%',
              fontWeight: '500',
              marginBottom: '10px',
            }}
          >
            Edit
          </Button>
          {onDelete && (
            <Button
              variant="outline-danger"
              onClick={onDelete}
              disabled={isDeleting}
              style={{
                borderRadius: '20px',
                width: '100%',
                fontWeight: '500',
              }}
            >
              {isDeleting ? <Spinner animation="border" size="sm" /> : 'Remove'}
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default ShoppingListCard;
