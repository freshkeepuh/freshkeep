import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ErrorPopUpProps {
  show: boolean;
  onClose: () => void;
  title: string;
  body: string;
}

function ErrorPopUp(props: ErrorPopUpProps): React.JSX.Element {
  const { show, onClose, title, body } = props;
  return (
    <Modal data-testid="error-popup" show={show} onHide={onClose} centered>
      <Modal.Header className="bg-danger text-white" closeButton>
        <Modal.Title data-testid="error-popup-title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p data-testid="error-popup-body">{body}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          data-testid="error-popup-ok-button"
          variant="primary"
          onClick={onClose}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ErrorPopUp;
