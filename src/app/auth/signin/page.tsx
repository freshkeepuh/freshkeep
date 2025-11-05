'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, UseFormRegister } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { signInValidation } from '@/lib/validationSchemas';
import ErrorPopUp from '@/components/ErrorPopUp';
import LogoHeader from '@/components/LogoHeader';
import WelcomeSection from '@/components/WelcomeSection';
import { redirect } from 'next/navigation';
import EmailAddressField, { IEmailAddressField } from '@/components/EmailAddressField';
import PasswordField, { IPasswordField } from '@/components/PasswordField';

import styles from './SignInPage.module.css';

type SignInForm = IEmailAddressField & IPasswordField;

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: yupResolver(signInValidation),
  });

  const [showError, setShowError] = useState(false);

  const onSubmit = async (data: SignInForm) => {
    const result = await signIn('credentials', { redirect: false, ...data });
    if (!result?.ok) {
      setShowError(true);
    } else {
      redirect('/');
    }
  };

  return (
    <main className={`${styles.authHero} ${styles.twoUp}`}>
      {/* LEFT SIDE (hero) */}
      <section
        className={`${styles.side} ${styles.left}`}
      >
        <div className={styles.overlayDark} />
        <div className={styles.welcomeWrap}>
          <WelcomeSection
            title="Welcome back!"
            subtitle="Sign in and see what's in your fridge."
          />
        </div>
      </section>

      {/* RIGHT SIDE (form) */}
      <section
        className={`${styles.side} ${styles.right}`}
      >
        <div className={styles.overlayLight} />
        <div className={styles.cardWrap}>
          <Card className={`shadow rounded-4 ${styles.glassyCard}`}>
            <Card.Body className="p-5">
              <LogoHeader />
              <h2 className="mb-4 fw-bold">Sign In</h2>

              <ErrorPopUp
                show={showError}
                onClose={() => setShowError(false)}
                title="Sign In Error"
                body="The email or password you entered is incorrect. Please check your credentials and try again."
              />

              <Form method="post" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-4">
                  <EmailAddressField
                    register={register as unknown as UseFormRegister<IEmailAddressField>}
                    errors={errors}
                    data-testid="sign-in-form-email-field"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <PasswordField
                    register={register as unknown as UseFormRegister<IPasswordField>}
                    errors={errors}
                    data-testid="sign-in-form-password-field"
                  />
                </Form.Group>

                <Row className="align-items-center mb-4">
                  <Col xs="auto">
                    <Button
                      data-testid="sign-in-form-submit"
                      type="submit"
                      variant="success"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing In…' : 'Sign In'}
                    </Button>
                  </Col>
                  <Col className="text-end">
                    <Button
                      data-testid="sign-in-form-reset"
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
              <span>New around here?&nbsp;</span>
              <Link
                data-testid="sign-in-form-signup-link"
                href="/auth/signup"
                className="fw-bold text-success"
              >
                Sign up
              </Link>
            </Card.Footer>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default SignInPage;
