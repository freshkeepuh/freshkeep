import React from 'react';
import { Container } from 'react-bootstrap';
import Settings from '@/components/Settings';

function SettingsPage(): React.JSX.Element {
  return (
    <Container className="fk-bg py-4 py-md-5" id="body">
      <Settings user={undefined as any} />
    </Container>
  );
}

export default SettingsPage;
