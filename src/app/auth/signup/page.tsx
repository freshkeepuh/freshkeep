'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbUserActions';
import EmailAddressField, { IEmailAddressField } from '@/components/EmailAddressField';
import ErrorPopUp from '@/components/ErrorPopUp';
import { useState } from 'react';
import { signUpValidation } from '@/lib/validationSchemas';
import "@/styles/auth.css";

type SignUpForm = IEmailAddressField & {
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: yupResolver(signUpValidation),
  });

  const onSubmit = async (data: SignUpForm) => {
    await createUser(data);

    const { email, password } = data;

    const result = await signIn('credentials', {
      email,
      password,
    });

    if (result?.error) {
      console.error('Sign up failed: ', result.error);
      setShowError(true);
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <main data-testid="sign-up-page" className="auth-hero">
      {/* Authentication error pop-up */}
      <ErrorPopUp
        data-testid="sign-up-page-error-popup"
        title="Sign Up Error"
        body="The email you entered is already registered. Please use a different email or sign in."
        show={showError}
        onClose={() => setShowError(false)}
      />

      {/* Left hero copy */}
      <div data-testid="sign-up-page-welcome-section" className="welcome-section">
        <h1 data-testid="sign-up-page-welcome-title" className="welcome-title">Create your account</h1>
        <h2
          data-testid="sign-up-page-welcome-subtitle"
          className="welcome-subtitle"
        >
          Join Fresh Keep and never let food go to waste.
        </h2>
      </div>

      {/* Right card */}
      <div className="auth-card-wrap">
        <Card className="shadow rounded-4">
          <Card.Body className="p-5">
            <div className="d-flex align-items-center justify-content-center mb-4">
              <Image
                src="/logo.svg"
                alt="Fresh Keep Logo"
                width={50}
                height={50}
                className="me-2"
              />
              <h1 data-testid="sign-up-page-title" className="text-center m-0">Fresh Keep</h1>
            </div>

            <h2 className="mb-4 fw-bold">Sign Up</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-4">
                <EmailAddressField
                  data-testid="sign-up-page-email-field"
                  errors={errors}
                  register={register as unknown as UseFormRegister<IEmailAddressField>}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control
                  data-testid="sign-up-page-password-field"
                  type="password"
                  placeholder="🔒 Password"
                  size="lg"
                  isInvalid={!!errors.password}
                  {...register('password')}
                />
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Control
                  data-testid="sign-up-page-confirm-password-field"
                  type="password"
                  placeholder="🔒 Confirm Password"
                  size="lg"
                  isInvalid={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
              </Form.Group>

              <Row className="align-items-center mb-4">
                <Col xs="auto">
                  <Button
                    data-testid="sign-up-page-submit-button"
                    type="submit"
                    variant="success"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating…' : 'Sign Up'}
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button
                    data-testid="sign-up-page-reset-button"
                    type="button"
                    variant="outline-secondary"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>

          <Card.Footer className="text-center py-3">
            <span>Already have an account?&nbsp;</span>
            <Link data-testid="sign-up-page-sign-in-link" href="/auth/signin" className="fw-bold text-success">
              Sign In
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </main>
  );
};

export default SignUp;
