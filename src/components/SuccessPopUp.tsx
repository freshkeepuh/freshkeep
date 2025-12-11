import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface SuccessPopUpProps {
  show: boolean;
  onClose: () => void;
  title: string;
  body: string;
}

function SuccessPopUp({
  show,
  onClose,
  title,
  body,
}: SuccessPopUpProps): React.JSX.Element {
  return (
    <Modal data-testid="success-popup" show={show} onHide={onClose} centered>
      <Modal.Header className="bg-success text-white" closeButton>
        <Modal.Title data-testid="success-popup-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p data-testid="success-popup-body">{body}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          data-testid="success-popup-ok-button"
          variant="primary"
          onClick={onClose}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessPopUp;
