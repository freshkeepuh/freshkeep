import { Container } from 'react-bootstrap';
import Link from 'next/link';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer
    className="mt-auto py-3 bg-success text-white"
    style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '-1px',
    }}
  >
    <Container className="d-flex flex-column flex-md-row justify-content-center align-items-center text-center gap-3">
      <div className="d-flex align-items-center gap-2">
        <strong>FreshKeep UH</strong>
        <span className="opacity-50">|</span>
        <small className="opacity-75">Where Organizing Meets Fresh</small>
      </div>

      <div className="d-flex align-items-center gap-2">
        <Link
          href="https://docs.freshkeepuh.live"
          className="text-white text-decoration-none fw-semibold"
        >
          About
        </Link>
        <span className="opacity-50">|</span>
        <small className="opacity-75">
          © 2025 FreshKeep UH. All rights reserved.
        </small>
      </div>
    </Container>
  </footer>
);

export default Footer;
