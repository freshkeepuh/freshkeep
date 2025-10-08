'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbUserActions';
import '@/styles/auth.css';
import { signUpValidation } from '@/lib/validationSchemas';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const validationSchema = signUpValidation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    await createUser(data);
    await signIn('credentials', { callbackUrl: '/', ...data });
  };

  return (
    <main className="auth-hero">
      {/* Left hero copy */}
      <div className="welcome-section">
        <h1 className="welcome-title">Create your account</h1>
        <h2 className="welcome-subtitle">Join Fresh Keep and never let food go to waste.</h2>
      </div>

      {/* Right card */}
      <div className="auth-card-wrap">
        <Card className="shadow rounded-4">
          <Card.Body className="p-5">
            <div className="d-flex align-items-center justify-content-center mb-4">
              <Image
                src="/multicolor-leaf2.png"
                alt="Fresh Keep Logo"
                width={50}
                height={50}
                className="me-2"
              />
              <h1 className="text-center m-0">Fresh Keep</h1>
            </div>

            <h2 className="mb-4 fw-bold">Sign Up</h2>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="signupEmail" className="mb-4">
                <Form.Control
                  data-testid="sign-up-form-email-field"
                  type="email"
                  placeholder="📧 Email"
                  size="lg"
                  isInvalid={!!errors.email}
                  {...register('email')}
                />
                <Form.Control.Feedback
                  data-testid="sign-up-form-email-field-error"
                  type="invalid"
                >
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="signupPassword" className="mb-4">
                <Form.Control
                  data-testid="sign-up-form-password-field"
                  type="password"
                  placeholder="🔒 Password"
                  size="lg"
                  isInvalid={!!errors.password}
                  {...register('password')}
                />
                <Form.Control.Feedback
                  data-testid="sign-up-form-password-field-error"
                  type="invalid"
                >
                  {errors.password?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="signupConfirm" className="mb-4">
                <Form.Control
                  data-testid="sign-up-form-confirm-password-field"
                  type="password"
                  placeholder="🔁 Confirm Password"
                  size="lg"
                  isInvalid={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <Form.Control.Feedback
                  data-testid="sign-up-form-confirm-password-field-error"
                  type="invalid"
                >
                  {errors.confirmPassword?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Row className="align-items-center mb-4">
                <Col xs="auto">
                  <Button
                    data-testid="sign-up-form-submit"
                    type="submit"
                    variant="success"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating…' : 'Create Account'}
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button
                    data-testid="sign-up-form-reset"
                    type="button"
                    variant="outline-secondary"
                    onClick={() => reset()}
                    size="lg"
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>

          <Card.Footer className="text-center py-3">
            <span>Already have an account?</span>
            <Link data-testid="sign-up-form-signin-link" href="/auth/signin" className="fw-bold text-success">
              Sign in
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </main>
  );
};

export default SignUp;
