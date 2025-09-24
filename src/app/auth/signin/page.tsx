'use client';

import { signIn } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row, Image } from 'react-bootstrap';

/**
 * Sign-in page component for Fresh Keep website.
 * 
 * Renders a sign-in form with email, password, and an optional
 * "Remember me" checkbox. Uses NextAuth `signIn` with the "credentials" provider.
 * If authentication fails, a modal is displayed and the error is logged to the console.
 */

const SignInPage = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
      rememberMe?: { checked: boolean };
    };

    const email = target.email.value;
    const password = target.password.value;
    const result = await signIn('credentials', {
      callbackUrl: '/',
      email,
      password,
    });

    if (result?.error) {
      console.error('Sign in failed: ', result.error);
    }
  };

  return (
    <main
      style={{
        backgroundImage: "url('/images/sign-in/Sign-in-bg-photo.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
      }}
    >
      <Container>
        <Row className="justify-content-center mt-5 gap-5">
          {/* #region Image Section */}
          <Col
            xs={12}
            md={7}
            lg={5}
            className="d-flex flex-column justify-content-center align-items-center text-white p-5"
          >
            <h1 className="fw-bold">Welcome back!</h1>
            <h2 className="fs-5">Sign in and see what&apos;s in your fridge.</h2>
          </Col>
          {/* #endregion Image Section */}
          {/* #region Sign In Form  */}
          <Col xs={12} md={6} lg={5} className="bg-white p-5 rounded shadow mt-5 ms-md-5">
            {/* Logo + Title */}
            <div className="d-flex align-items-center justify-content-center mb-3">
              <Image
                src="/multicolor-leaf2.png"
                alt="Fresh Keep Logo"
                width={40}
                height={40}
                className="me-2"
              />
              <h1 className="text-center m-0">Fresh Keep</h1>
            </div>

            <h2 className="text-left mb-3 fw-bold">Sign In</h2>
            <Card>
              <Card.Body>
                <Form method="post" onSubmit={handleSubmit}>
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Control
                      name="email"
                      type="text"
                      placeholder="👤Username or Email"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword" className="mb-3">
                    <Form.Control
                      name="password"
                      type="password"
                      placeholder="🔒Password"
                      required
                    />
                  </Form.Group>

                  {/* Remember me + Forgot password */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      label="Remember me"
                    />
                    <a href="/forgot-password" className="fw-semibold text-success">
                      Forgot Password?
                    </a>
                  </div>

                  <div className="d-grid">
                    <Button type="submit" variant="success">
                      Sign In
                    </Button>
                  </div>
                </Form>
              </Card.Body>

              <Card.Footer className="text-center">
                New around here?
                {' '}
                <a href="/auth/signup" className="fw-bold text-success">
                  Sign up
                </a>
              </Card.Footer>
            </Card>
          </Col>
          {/* #endregion Sign in Form */}
        </Row>
      </Container>
    </main>
  );
};

export default SignInPage;
