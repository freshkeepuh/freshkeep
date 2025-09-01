import { Col, Container } from 'react-bootstrap';

const Footer = () => {
  const divStyle = { paddingTop: '15px' };
  return (
    <footer className="mt-auto bg-light">
      <Container style={divStyle}>
        <Col className="text-center">
          Department of Information and Computer Sciences
          <br />
          University of Hawaii at Manoa
          <br />
          Honolulu, HI 96822
          <br />
          <a href="http://ics-software-engineering.github.io/meteor-example-form-react">Template Home Page</a>
        </Col>
      </Container>
    </footer>
  );
};

export default Footer;
