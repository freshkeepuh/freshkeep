'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/settings.css';
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  ButtonGroup,
  ToggleButton,
  Toast,
  ToastContainer,
} from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Modal from 'react-bootstrap/Modal';
import {
  PersonCircle,
  Palette,
  ExclamationTriangle,
  BoxArrowRight,
  CheckCircleFill,
  ExclamationCircleFill,
} from 'react-bootstrap-icons';

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  theme?: 'light' | 'dark';
  units?: 'Imperial' | 'Metric';
  country?: string;
}

interface Props {
  user?: UserData;
}

const DEFAULT_UNITS: 'Imperial' | 'Metric' = 'Imperial';
const DEFAULT_COUNTRY = 'USA';
const DEFAULT_USER: UserData = {
  firstName: '',
  lastName: '',
  email: '',
  theme: 'light',
  units: DEFAULT_UNITS,
  country: DEFAULT_COUNTRY,
};

const applyTheme = (t: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  const { documentElement: root, body } = document;
  root.classList.remove('light', 'dark');
  body.classList.remove('light', 'dark');
  root.classList.add(t);
  body.classList.add(t);
  if (typeof localStorage !== 'undefined') localStorage.setItem('fk-theme', t);
};

function Settings({ user = DEFAULT_USER }: Props) {
  const router = useRouter();

  const [theme, setTheme] = useState<'light' | 'dark'>(user.theme ?? 'light');
  const [firstName, setFirstName] = useState<string>(user.firstName ?? '');
  const [lastName, setLastName] = useState<string>(user.lastName ?? '');
  const [email, setEmail] = useState<string>(user.email ?? '');
  const [units, setUnits] = useState<'Imperial' | 'Metric'>(
    user.units ?? DEFAULT_UNITS,
  );
  const [country, setCountry] = useState<string>(
    user.country ?? DEFAULT_COUNTRY,
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // pop up notif
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>(
    'success',
  );

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setEmail(user.email ?? '');
      setUnits(user.units ?? DEFAULT_UNITS);
      setCountry(user.country ?? DEFAULT_COUNTRY);

      if (user.theme) {
        setTheme(user.theme);
        applyTheme(user.theme);
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('fk-theme') as 'light' | 'dark' | null;
    const sysDark =
      window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

    const initial = user.theme ?? saved ?? (sysDark ? 'dark' : 'light');

    setTheme(initial);
    applyTheme(initial);
  }, [user.theme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      firstName,
      lastName,
      email,
      units,
      country,
      theme,
    };

    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setToastVariant('success');
      setToastMessage('Your settings have been saved successfully.');
      setShowToast(true);
      router.refresh();
    } catch {
      setToastVariant('danger');
      setToastMessage('Failed to save settings. Please try again.');
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1050 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header
            closeButton={false}
            className="d-flex justify-content-between"
          >
            <strong
              className={
                toastVariant === 'success'
                  ? 'me-auto text-success'
                  : 'me-auto text-danger'
              }
            >
              {toastVariant === 'success' ? (
                <CheckCircleFill className="me-2" />
              ) : (
                <ExclamationCircleFill className="me-2" />
              )}
              {toastVariant === 'success' ? 'Success' : 'Error'}
            </strong>
            <small>Just now</small>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            />
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <section className="rounded-4 p-4 p-md-5 mb-4 mb-md-5 header-hero border-0 shadow-xs">
        <h1 className="fw-bold lh-sm m-0 text-body">User Settings</h1>
        <p className="m-0 text-body-secondary mt-2">
          Changes are saved to your account.
        </p>
      </section>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="border-0 card-elevated h-100">
            <Card.Header className="bg-transparent border-0 pb-0">
              <div className="d-flex align-items-center gap-3">
                <span className="chip chip-primary">
                  <PersonCircle aria-hidden />
                </span>
                <div>
                  <h3 className="h5 m-0 text-body">User Information</h3>
                  <small className="text-body-secondary">
                    Name, region & units
                  </small>
                </div>
              </div>
            </Card.Header>

            <Card.Body className="pt-4">
              <form className="vstack gap-3" noValidate onSubmit={onSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <FloatingLabel controlId="firstName" label="First Name">
                      <Form.Control
                        type="text"
                        placeholder=" "
                        aria-label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="lastName" label="Last Name">
                      <Form.Control
                        type="text"
                        placeholder=" "
                        aria-label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Row className="g-3">
                  <Col md={12}>
                    <FloatingLabel controlId="email" label="Email">
                      <Form.Control
                        type="email"
                        placeholder=""
                        aria-label="Email"
                        value={email}
                        readOnly
                        disabled
                        className="bg-light"
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Row className="g-3">
                  <Col md={6}>
                    <FloatingLabel controlId="units" label="Units">
                      <Form.Select
                        aria-label="Units"
                        value={units}
                        onChange={(e) =>
                          setUnits(
                            e.currentTarget.value as 'Imperial' | 'Metric',
                          )
                        }
                      >
                        <option value="Imperial">Imperial</option>
                        <option value="Metric">Metric</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="country" label="Country">
                      <Form.Select
                        aria-label="Country"
                        value={country}
                        onChange={(e) => setCountry(e.currentTarget.value)}
                      >
                        <option value="USA">USA</option>
                        <option value="Canada">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Japan">Japan</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>

                <div className="d-grid mt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn-gradient btn-lg"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 card-elevated h-100">
            <Card.Header className="bg-transparent border-0 pb-0">
              <div className="d-flex align-items-center gap-3">
                <span className="chip chip-indigo">
                  <Palette aria-hidden />
                </span>
                <div>
                  <h3 className="h5 m-0 text-body">Appearance</h3>
                  <small className="text-body-secondary">
                    Choose your theme
                  </small>
                </div>
              </div>
            </Card.Header>

            <Card.Body className="pt-4">
              <div className="vstack gap-2">
                <span className="form-label mb-1">Theme</span>
                <ButtonGroup className="segmented w-100">
                  <ToggleButton
                    id="theme-light"
                    type="radio"
                    variant={theme === 'light' ? 'light' : 'outline-secondary'}
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={() => setTheme('light')}
                    className="segmented-item"
                    aria-pressed={theme === 'light'}
                  >
                    <span className="swatch swatch-light rounded-2 border me-2" />
                    Light
                  </ToggleButton>
                  <ToggleButton
                    id="theme-dark"
                    type="radio"
                    variant={
                      theme === 'dark' ? 'secondary' : 'outline-secondary'
                    }
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={() => setTheme('dark')}
                    className="segmented-item"
                    aria-pressed={theme === 'dark'}
                  >
                    <span className="swatch swatch-dark rounded-2 me-2" />
                    Dark
                  </ToggleButton>
                </ButtonGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="border-0 card-elevated h-100">
            <Card.Header className="bg-transparent border-0 pb-0">
              <div className="d-flex align-items-center gap-3">
                <span className="chip chip-amber">
                  <ExclamationTriangle aria-hidden />
                </span>
                <div>
                  <h3 className="h5 m-0 text-body">Account Actions</h3>
                  <small className="text-body-secondary">
                    Sensitive actions require confirmation
                  </small>
                </div>
              </div>
            </Card.Header>

            <Card.Body className="pt-4">
              <Button
                type="button"
                variant="outline-danger"
                className="w-100 d-flex align-items-center justify-content-center gap-2 btn-tonal-danger"
                onClick={() => setConfirmOpen(true)}
              >
                <BoxArrowRight size={18} aria-hidden />
                <span>Sign Out</span>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={confirmOpen} onHide={() => setConfirmOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign out?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-body-secondary">
          You’ll need to log in again to access your account.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setConfirmOpen(false);
              router.push('/auth');
            }}
          >
            Sign Out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Settings.defaultProps = {
  user: DEFAULT_USER,
};

export default Settings;
