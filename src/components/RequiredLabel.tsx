import { Form } from 'react-bootstrap';

export default function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <Form.Label aria-required="true">
      {children}
      {' '}
      <span style={{ color: 'red' }}>*</span>
    </Form.Label>
  );
}
