import { Form } from 'react-bootstrap';

export default function RequiredLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <Form.Label aria-required="true" htmlFor={htmlFor}>
      {children}
      &nbsp;
      <span style={{ color: 'red' }}>*</span>
    </Form.Label>
  );
}
