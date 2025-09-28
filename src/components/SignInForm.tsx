'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbUserActions';
import { useState } from 'react';
import { signInValidation } from '@/lib/validationSchemas';
import EmailAddressField, { IEmailAddressField } from '@/components/EmailAddressField';
import ErrorPopUp from '@/components/ErrorPopUp';
import PasswordField, { IPasswordField } from '@/components/PasswordField';
import "@/styles/auth.css";
import { Pass } from 'react-bootstrap-icons';

type SignInFormFields = IEmailAddressField & IPasswordField;

const SignInForm = () => {
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormFields>({
    resolver: yupResolver(signInValidation),
  });


  const onSubmit = async (data: SignInFormFields) => {
    const { email, password } = data;

    const result = await signIn('credentials', {
      email,
      password,
    });

    if (result?.error) {
      console.error('Sign up failed: ', result.error);
      setShowError(true);
    } else if (result?.url && result.url !== window.location.href) {
      console.warn('Redirecting to: ', result.url);
      window.location.href = result.url;
    } else {
      console.warn('No redirect URL found, redirecting to home');
      window.location.href = '/';
    }
  };

  return (
    <main data-testid="sign-in-form" className="signin-hero">
      {/* Authentication error pop-up */}
      <ErrorPopUp
        data-testid="sign-in-form-error-popup"
        title="Sign In Error"
        body="The email or password you entered is incorrect. Please check your credentials and try again."
        show={showError}
        onClose={() => setShowError(false)}
      />

      {/* Welcome section */}
      <Container className="vh-100 w-100 d-flex">
        <Row className="w-100">
          {/* Left welcome section */}
          <Col className="welcome-section d-flex align-items-center justify-content-left mx-auto text-white">
            <div data-testid="sign-in-form-welcome-section" className="welcome-section justify-content-center">
              <h1 data-testid="sign-in-form-welcome-title" className="welcome-title">Welcome back!</h1>
              <h2
                data-testid="sign-in-form-welcome-subtitle"
                className="welcome-subtitle"
              >
                Sign in and see what&apos;s in your fridge.
              </h2>
            </div>
          </Col>
          {/* Right card */}
          <Col className="d-flex align-items-center justify-content-right mx-auto">
            <Card className="shadow rounded-4">
              <Card.Header className="text-center bg-white py-3">
                <div className="d-flex align-items-center justify-content-center mb-4">
                  <Image
                    data-testid="sign-in-form-logo"
                    src="/logo.svg"
                    alt="Fresh Keep Logo"
                    width={50}
                    height={50}
                    className="me-2"
                  />
                  <h1 data-testid="sign-in-form-title" className="text-center m-0">Fresh Keep</h1>
                </div>
              </Card.Header>
              <Card.Body className="p-5">
                <h2 className="mb-4 fw-bold">Sign In</h2>
                <Form method="post" onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-4">
                    <EmailAddressField
                      data-testid="sign-in-form-email-field"
                      errors={errors}
                      register={register as unknown as UseFormRegister<IEmailAddressField>}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <PasswordField
                      data-testid="sign-in-form-password-field"
                      errors={errors}
                      register={register as unknown as UseFormRegister<IPasswordField>}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      data-testid="sign-in-form-remember-me-checkbox"
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      label="Remember me"
                    />
                    <Link
                      data-testid="sign-in-form-forgot-password-link"
                      href="/auth/forgot-password"
                      className="fw-semibold text-success"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Row className="align-items-center mb-4">
                    <Col xs="auto">
                      <Button
                        data-testid="sign-in-form-submit-button"
                        type="submit"
                        variant="success"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                      </Button>
                    </Col>
                    <Col className="text-end">
                      <Button
                        data-testid="sign-in-form-reset-button"
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
                <span>New around here?&nbsp;</span>
                <Link data-testid="sign-in-form-sign-up-link" href="/auth/signup" className="fw-bold text-success">
                  Sign up
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignInForm;
