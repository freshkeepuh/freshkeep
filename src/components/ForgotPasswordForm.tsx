'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { forgotPasswordValidation } from '@/lib/validationSchemas';
import { toast } from 'react-toastify';
import EmailAddressField, { IEmailAddressField } from './EmailAddressField';
import '../styles/auth.css';

export type ForgotPasswordFormFields = IEmailAddressField;

async function emailResetlink(data: ForgotPasswordFormFields) {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: data.email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send reset link.');
    }

    toast.success('Reset link sent to your email!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    toast.error(errorMessage);
    console.error(error);
  }
}

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormFields>({
    resolver: yupResolver(forgotPasswordValidation),
  });

  const onSubmit = async (data: ForgotPasswordFormFields) => {
    await emailResetlink(data);
  };

  return (
    <main className="signin-hero">
      <Container className="vh-100 w-100 d-flex">
        <Row className="w-100">
          {/* Left welcome section */}
          <Col className="welcome-section d-flex align-items-center justify-content-left mx-auto text-white">
            <div>
              <h1 className="welcome-title">Welcome Back!</h1>
              <p className="welcome-subtitle">To keep connected with us enter your email to get a password reset</p>
            </div>
          </Col>
          {/* Right card */}
          <Col className="d-flex align-items-center justify-content-right mx-auto">
            <Card className="shadow rounded-4">
              <Card.Header className="text-center bg-white py-3">
                <div className="d-flex align-items-center justify-content-center mb-4">
                  <Image
                    src="/logo.svg"
                    alt="Fresh Keep Logo"
                    width={50}
                    height={50}
                    className="me-2"
                  />
                  <h1 className="text-center m-0">Fresh Keep</h1>
                </div>
              </Card.Header>
              <Card.Body className="p-5">
                <h2 className="mb-4 fw-bold">Forgot Password</h2>

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group controlId="forgotPasswordEmail" className="mb-4">
                    <EmailAddressField register={register} errors={errors} />
                  </Form.Group>

                  <Row className="align-items-center mb-4">
                    <Col xs="auto">
                      <Button type="submit" variant="success" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send'}
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
                <span>Remember your Password?&nbsp;</span>
                <Link href="/auth/signin" className="fw-bold text-success">
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

export default ForgotPasswordForm;
