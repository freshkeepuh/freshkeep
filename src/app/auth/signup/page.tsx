'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import { createUser, checkUser } from '@/lib/dbUserActions';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid')
      .test('unique-email', 'Email already exists', async (value) => {
        if (!value) return false;
        return !(await checkUser({ email: value }));
      }),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Confirm Password does not match'),
  });

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
                  type="email"
                  placeholder="📧 Email"
                  size="lg"
                  isInvalid={!!errors.email}
                  {...register('email')}
                />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="signupPassword" className="mb-4">
                <Form.Control
                  type="password"
                  placeholder="🔒 Password"
                  size="lg"
                  isInvalid={!!errors.password}
                  {...register('password')}
                />
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="signupConfirm" className="mb-4">
                <Form.Control
                  type="password"
                  placeholder="🔁 Confirm Password"
                  size="lg"
                  isInvalid={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
              </Form.Group>

              <Row className="align-items-center mb-4">
                <Col xs="auto">
                  <Button type="submit" variant="success" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating…' : 'Create Account'}
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button type="button" variant="outline-secondary" onClick={() => reset()}>
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>

          <Card.Footer className="text-center py-3">
            <span>Already have an account?</span>
            <Link href="/auth/signin" className="fw-bold text-success">
              Sign in
            </Link>
          </Card.Footer>
        </Card>
      </div>

      {/* Styles */}
      <style>
        {`
          .auth-hero {
            position: relative;
            background-image: url('/images/sign-up/Sign-up-bg2.png');
            background-size: cover;
            background-position: center;
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 5vh 4rem;
            overflow: hidden;
          }

          .auth-hero::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to right,
              rgba(0,0,0,0.55) 0%,
              rgba(0,0,0,0.25) 35%,
              rgba(0,0,0,0) 60%
            );
            pointer-events: none;
            z-index: 1;
          }

          .welcome-section {
            position: relative;
            z-index: 2;
            color: white;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            max-width: 500px;
            margin-right: 3rem;
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

          .auth-card-wrap {
            position: relative;
            z-index: 2;
            width: 500px;
            flex-shrink: 0;
            margin-left: auto;
            margin-right: 6rem;
          }

          @media (max-width: 992px) {
            .auth-hero {
              flex-direction: column;
              justify-content: center;
              gap: 2rem;
              text-align: center;
              padding: 5vh 1.25rem;
            }

            .auth-hero::before {
              background: linear-gradient(
                to bottom,
                rgba(0,0,0,0.55) 0%,
                rgba(0,0,0,0.25) 40%,
                rgba(0,0,0,0) 70%
              );
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

            .auth-card-wrap {
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

export default SignUp;
