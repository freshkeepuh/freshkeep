'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { createUser } from '@/lib/dbUserActions';
import '@/styles/auth.css';
import { signUpValidation } from '@/lib/validationSchemas';
import ErrorPopUp from '@/components/ErrorPopUp';
import LogoHeader from '@/components/LogoHeader';
import WelcomeSection from '@/components/WelcomeSection';
import EmailAddressField, { IEmailAddressField } from '@/components/EmailAddressField';
import PasswordField, { IPasswordField } from '@/components/PasswordField';
import ConfirmPasswordField, { IConfirmPasswordField } from '@/components/ConfirmPasswordField';

type SignUpForm = IEmailAddressField & IPasswordField & IConfirmPasswordField;

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: yupResolver(signUpValidation),
  });

  const [showError, setShowError] = useState(false);

  const onSubmit = async (data: SignUpForm) => {
    try {
      await createUser(data);
      await signIn('credentials', { callbackUrl: '/', redirect: true, ...data });
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <main className="auth-hero">
      {/* Authentication error pop-up */}
      <ErrorPopUp
        show={showError}
        onClose={() => setShowError(false)}
        title="Sign Up Error"
        body="The email you entered is already in use. Please check your credentials and try again."
      />

      {/* Welcome section */}
      <WelcomeSection
        title="Create your account"
        subtitle="Join Fresh Keep and see what&apos;s in your fridge."
      />

      {/* Sign Up form section */}
      <div className="auth-card-wrap">
        <Card className="shadow rounded-4">
          {/* increased padding */}
          <Card.Body className="p-5">
            <LogoHeader />
            <h2 className="mb-4 fw-bold">Sign Up</h2>
            <Form method="post" onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-4">
                <EmailAddressField
                  register={register as unknown as UseFormRegister<IEmailAddressField>}
                  errors={errors}
                  data-testid="sign-up-form-email-field"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <PasswordField
                  register={register as unknown as UseFormRegister<IPasswordField>}
                  errors={errors}
                  data-testid="sign-up-form-password-field"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <ConfirmPasswordField
                  register={register as unknown as UseFormRegister<IConfirmPasswordField>}
                  errors={errors}
                  data-testid="sign-up-form-confirm-password-field"
                />
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
                    {isSubmitting ? 'Signing Up…' : 'Sign Up'}
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
            <span>Already have an account?&nbsp;</span>
            <Link
              data-testid="sign-up-form-signin-link"
              href="/auth/signin"
              className="fw-bold text-success"
            >
              Sign in
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </main>
  );
};

export default SignUpPage;
