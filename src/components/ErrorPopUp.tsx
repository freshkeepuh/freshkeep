import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ErrorPopUpProps {
    show: boolean;
    onClose: () => void;
    title: string;
    body: string;
}

const ErrorPopUp: React.FC<ErrorPopUpProps> = ({ show, onClose, title, body }) => (
    <Modal show={show} onHide={onClose} centered>
        <Modal.Header className="bg-danger text-white" closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{body}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                OK
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ErrorPopUp;
