import { Button } from 'react-bootstrap';
import { Pencil, Trash } from 'react-bootstrap-icons';

interface LocationCardProps {
  id: string;
  name: string;
  address: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const LocationCard = ({ id, name, address, onEdit, onDelete }: LocationCardProps) => (
  <li
    className="d-flex flex-column mb-3 p-3"
    style={{
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
    }}
  >
    {/* Header with name and action buttons */}
    <div className="d-flex align-items-center justify-content-between mb-2">
      <h6 className="mb-0 fw-bold text-dark">{name}</h6>
      <span>
        <Button
          variant="outline-dark"
          size="sm"
          className="me-2 p-1"
          aria-label={`Edit ${name}`}
          onClick={() => onEdit(id)}
        >
          <Pencil />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          className="p-1"
          aria-label={`Delete ${name}`}
          onClick={() => onDelete(id)}
        >
          <Trash />
        </Button>
      </span>
    </div>
    
    {/* Address */}
    <div className="text-muted small">
      <strong>Address:</strong> {address}
    </div>
  </li>
);

export default LocationCard;
