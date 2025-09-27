'use client';

import ErrorPopUp from '@/components/ErrorPopUp';
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
    const rememberMe = target.rememberMe?.checked || false;

    const result = await signIn('credentials', {
      email,
      password,
    });

    if (result?.error) {
      console.error('Sign in failed: ', result.error);
      setShowError(true);
    } else if (result?.url) {
      console.error('Sign in successful, redirecting to: ', result.url);
      window.location.href = result.url;
    }
  };

  return (
    <main data-testid="sign-in-page" className="signin-hero">
      {/* Authentication error pop-up */}
      <ErrorPopUp
        data-testid="sign-in-page-error-popup"
        title='Sign In Error'
        body='The email or password you entered is incorrect. Please check your credentials and try again.'
        show={showError}
        onClose={() => setShowError(false)}
      />

      {/* Welcome section */}
      <div data-testid="sign-in-page-welcome-section" className="welcome-section justify-content-center">
        <h1 data-testid="sign-in-page-welcome-title" className="welcome-title">Welcome back!</h1>
        <h2 data-testid="sign-in-page-welcome-subtitle" className="welcome-subtitle">Sign in and see what&apos;s in your fridge.</h2>
      </div>

      {/* Sign In form section */}
      <div className="signin-card-wrap">
        <Card className="shadow rounded-4">
          {/* increased padding */}
          <Card.Body className="p-5">
            <div className="d-flex align-items-center justify-content-center mb-4">
              <Image
                data-testid="sign-in-page-logo"
                src="/logo.svg"
                alt="Fresh Keep Logo"
                width={50} /* bigger logo */
                height={50}
                className="me-2"
              />
              <h1 data-testid="sign-in-page-title" className="text-center m-0">Fresh Keep</h1>
            </div>

            <h2 className="mb-4 fw-bold">Sign In</h2>
            <Form method="post" onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Control
                  data-testid="sign-in-page-email-field"
                  name="email"
                  type="email"
                  placeholder="👤 Username or Email"
                  required
                  autoFocus
                  size="lg" /* larger input */
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control
                  data-testid="sign-in-page-password-field"
                  name="password"
                  type="password"
                  placeholder="🔒 Password"
                  required
                  size="lg"
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check
                  data-testid="sign-in-page-remember-me-checkbox"
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  label="Remember me"
                />
                <Link data-testid="sign-in-page-forgot-password-link" href="/auth/forgot-password" className="fw-semibold text-success">
                  Forgot Password?
                </Link>
              </div>

              <div className="d-grid">
                <Button data-testid="sign-in-page-submit-button" type="submit" variant="success" size="lg">
                  Sign In
                </Button>
              </div>
            </Form>
          </Card.Body>

          <Card.Footer className="text-center py-3">
            <span>New around here?</span>
            {' '}
            <Link data-testid="sign-in-page-sign-up-link" href="/auth/signup" className="fw-bold text-success">
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
