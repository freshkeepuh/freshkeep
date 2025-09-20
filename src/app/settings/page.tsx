import { Container } from 'react-bootstrap';
import Settings from '@/components/settings/Settings';

const SettingsPage = (): JSX.Element => (
  <Container className="fk-bg py-4 py-md-5" id="body">
    <Settings />
  </Container>
);

export default SettingsPage;
