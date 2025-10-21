import React from 'react';
import { Image } from 'react-bootstrap';

const LogoHeader: React.FC = () => (
  <div className="d-flex align-items-center justify-content-center mb-4">
    <Image
      src="/logo.svg"
      alt="Fresh Keep Logo"
      width={50}
      height={50}
      className="me-2"
    />
    <h1 className="text-center m-0">Fresh Keep</h1>
  </div>
);

export default LogoHeader;
