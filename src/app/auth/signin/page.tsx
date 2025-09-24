'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Card, Form, Image, Modal } from 'react-bootstrap';

const SignIn = () => {
  const [showError, setShowError] = useState(false);
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
      redirect: false,
    });

    if (result?.error) {
      console.error('Sign in failed: ', result.error);
      setShowError(true);
    }
  };

  return (
    <main className="signin-hero">
      {/* Authentication error pop-up */}
      <Modal show={showError} onHide={() => setShowError(false)} centered>
        <Modal.Header className="bg-danger text-white" closeButton>
          <Modal.Title>Sign In Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The email or passsword you entered is incorrect. Please check your credentials and try again.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowError(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Welcome section */}
      <div className="welcome-section justify-content-center">
        <h1 className="welcome-title">Welcome back!</h1>
        <h2 className="welcome-subtitle">Sign in and see what&apos;s in your fridge.</h2>
      </div>

      {/* Sign In form section */}
      <div className="signin-card-wrap">
        <Card className="shadow rounded-4">
          {/* increased padding */}
          <Card.Body className="p-5">
            <div className="d-flex align-items-center justify-content-center mb-4">
              <Image
                src="/multicolor-leaf2.png"
                alt="Fresh Keep Logo"
                width={50} /* bigger logo */
                height={50}
                className="me-2"
              />
              <h1 className="text-center m-0">Fresh Keep</h1>
            </div>

            <h2 className="mb-4 fw-bold">Sign In</h2>
            <Form method="post" onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mb-4">
                <Form.Control
                  name="email"
                  type="text"
                  placeholder="👤 Username or Email"
                  required
                  size="lg" /* larger input */
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-4">
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="🔒 Password"
                  required
                  size="lg"
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  label="Remember me"
                />
                <Link href="/forgot-password" className="fw-semibold text-success">
                  Forgot Password?
                </Link>
              </div>

              <div className="d-grid">
                <Button type="submit" variant="success" size="lg">
                  Sign In
                </Button>
              </div>
            </Form>
          </Card.Body>

          <Card.Footer className="text-center py-3">
            <span>New around here?</span>
            {' '}
            <Link href="/auth/signup" className="fw-bold text-success">
              Sign up
            </Link>
          </Card.Footer>
        </Card>
      </div>

      <style>
        {`
          .signin-hero {
            background-image: url('/images/sign-in/Sign-in-bg-photo.png');
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 5vh 4rem;
          }

          .welcome-section {
            color: white;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            max-width: 500px;
            // margin-right: 3rem;
          }

          .welcome-title {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
          }

          .welcome-subtitle {
            font-size: 2.5rem;
            font-weight: 500;
          }

          .signin-card-wrap {
            width: 500px;
            flex-shrink: 0;
            margin-left: auto;
            margin-right: 6rem; /* pushes the card farther from the edge */
          }

          /* Mobile: stack vertically */
          @media (max-width: 992px) {
            .signin-hero {
              flex-direction: column;
              justify-content: center;
              gap: 2rem;
              text-align: center;
              padding: 5vh 1.25rem;
            }

            .welcome-section {
              margin-right: 0;
              text-align: center;
            }

            .welcome-title {
              font-size: 2.25rem;
            }

            .welcome-subtitle {
              font-size: 1.2rem;
            }

            .signin-card-wrap {
              width: 100%;
              max-width: 500px;
              margin-left: 0;
              margin-right: 0;
            }
          }
        `}
      </style>
    </main>
  );
};

export default SignIn;
