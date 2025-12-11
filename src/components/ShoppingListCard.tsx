import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';

interface ShoppingListCardProps {
  listTitle: string;
  items: string[];
  onEdit: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const MAX_VISIBLE_ITEMS = 4;

function ShoppingListCard({
  listTitle,
  items,
  onEdit,
  onDelete,
  isDeleting,
}: ShoppingListCardProps) {
  const visibleItems = items.slice(0, MAX_VISIBLE_ITEMS);
  const remainingCount = items.length - MAX_VISIBLE_ITEMS;
  const hasMoreItems = remainingCount > 0;

  return (
    <Card
      style={{
        width: '280px',
        height: '340px',
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#28a745',
          padding: '16px 20px',
          color: 'white',
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>
            {listTitle}
          </h5>
          <Badge
            bg="light"
            text="success"
            pill
            style={{ fontSize: '0.75rem', fontWeight: 600 }}
          >
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>
      </div>

      {/* Items List */}
      <div
        style={{
          flex: 1,
          padding: '12px 16px',
          backgroundColor: '#fafafa',
          overflow: 'hidden',
        }}
      >
        {items.length === 0 ? (
          <div
            className="text-muted text-center d-flex align-items-center justify-content-center"
            style={{ height: '100%', fontSize: '0.9rem' }}
          >
            <div>
              <span style={{ fontSize: '2rem' }}>🛒</span>
              <p className="mb-0 mt-2">No items yet</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {visibleItems.map((item, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={`${item}-${index}`}
                style={{
                  backgroundColor: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#28a745',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
            {hasMoreItems && (
              <div
                style={{
                  color: '#6c757d',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  padding: '4px 0',
                  fontStyle: 'italic',
                }}
              >
                +{remainingCount} more {remainingCount === 1 ? 'item' : 'items'}
                ...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #eee',
          backgroundColor: 'white',
          display: 'flex',
          gap: '8px',
        }}
      >
        <Button
          variant="success"
          onClick={onEdit}
          style={{
            flex: 1,
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          Open List
        </Button>
        {onDelete && (
          <Button
            variant="outline-danger"
            onClick={onDelete}
            disabled={isDeleting}
            style={{
              borderRadius: '8px',
              padding: '0.375rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '42px',
            }}
          >
            {isDeleting ? <Spinner animation="border" size="sm" /> : '🗑️'}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default ShoppingListCard;
