'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbUserActions';
import { useState } from 'react';
import { signUpValidation } from '@/lib/validationSchemas';
import ConfirmPasswordField, { IConfirmPasswordField } from '@/components/ConfirmPasswordField';
import EmailAddressField, { IEmailAddressField } from '@/components/EmailAddressField';
import ErrorPopUp from '@/components/ErrorPopUp';
import PasswordField, { IPasswordField } from '@/components/PasswordField';
import '@/styles/auth.css';

type SignUpFormFields = IEmailAddressField & IPasswordField & IConfirmPasswordField;

const SignUpForm = () => {
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormFields>({
    resolver: yupResolver(signUpValidation),
  });

  const onSubmit = async (data: SignUpFormFields) => {
    await createUser(data);

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
    <main data-testid="sign-up-form" className="auth-hero">
      {/* Authentication error pop-up */}
      <ErrorPopUp
        data-testid="sign-up-form-error-popup"
        title="Sign Up Error"
        body="The email you entered is already registered. Please use a different email or sign in."
        show={showError}
        onClose={() => setShowError(false)}
      />

      {/* Welcome section */}
      <Container className="vh-100 w-100 d-flex">
        <Row className="w-100">
          {/* Left welcome section */}
          <Col className="welcome-section d-flex align-items-center justify-content-left mx-auto text-white">
            <div data-testid="sign-up-form-welcome-section" className="welcome-section justify-content-center">
              <h1 data-testid="sign-up-form-welcome-title" className="welcome-title">Create your account</h1>
              <h2
                data-testid="sign-up-form-welcome-subtitle"
                className="welcome-subtitle"
              >
                Join Fresh Keep and never let food go to waste.
              </h2>
            </div>
          </Col>
          {/* Right card */}
          <Col className="d-flex align-items-center justify-content-right mx-auto">
            <Card className="shadow rounded-4">
              <Card.Header className="text-center bg-white py-3">
                <div className="d-flex align-items-center justify-content-center mb-4">
                  <Image
                    data-testid="sign-up-form-logo"
                    src="/logo.svg"
                    alt="Fresh Keep Logo"
                    width={50}
                    height={50}
                    className="me-2"
                  />
                  <h1 data-testid="sign-up-form-title" className="text-center m-0">Fresh Keep</h1>
                </div>
              </Card.Header>
              <Card.Body className="p-5">
                <h2 className="mb-4 fw-bold">Sign Up</h2>
                <Form method="post" onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group className="mb-4">
                    <EmailAddressField
                      data-testid="sign-up-form-email-field"
                      errors={errors}
                      register={register as unknown as UseFormRegister<IEmailAddressField>}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <PasswordField
                      data-testid="sign-up-form-password-field"
                      errors={errors}
                      register={register as unknown as UseFormRegister<IPasswordField>}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <ConfirmPasswordField
                      data-testid="sign-up-form-confirm-password-field"
                      errors={errors}
                      register={register as unknown as UseFormRegister<IConfirmPasswordField>}
                    />
                  </Form.Group>

                  <Row className="align-items-center mb-4">
                    <Col xs="auto">
                      <Button
                        data-testid="sign-up-form-submit-button"
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
                        data-testid="sign-up-form-reset-button"
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
                <Link data-testid="sign-up-form-sign-in-link" href="/auth/signin" className="fw-bold text-success">
                  Sign In
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default SignUpForm;
