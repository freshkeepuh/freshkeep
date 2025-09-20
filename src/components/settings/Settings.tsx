'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './settings.css';
import { Row, Col, Card, Button } from 'react-bootstrap';

/**
 * Settings component: manages user profile and appearance preferences
 */

const Settings = (): JSX.Element => {
  const router = useRouter();

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [name, setName] = useState<string>('');
  const [email] = useState<string>('');

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSubmitProfile: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // TODO: add js that will handle profile mutation
  };

  const handleSignOut = (): void => {
    router.push('/auth');
    // TODO: add a warning "are you sure you want to logo out?"
  };

  return (
    <>
      <header className="mb-4 mb-md-5 fade-in">
        <h2 className="fw-bold fs-3 text-dark mb-1">User Settings</h2>
        <p className="text-muted m-0">Manage your account preferences and settings</p>
      </header>

      <Row className="g-4">

        {/* Profile Settings */}

        <Col lg={6}>
          <Card className="border-0 shadow-sm fade-in h-100">
            <Card.Body>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="icon-chip">
                  <svg width="24" height="24" className="text-primary" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="h5 m-0 text-dark">User Information</h3>
              </div>

              <form id="profileForm" className="vstack gap-3" noValidate onSubmit={handleSubmitProfile}>
                <div>
                  <label htmlFor="userName" className="form-label w-100">
                    <span className="d-block mb-1">Full Name</span>
                    <input
                      type="text"
                      id="userName"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={({ target: { value } }) => setName(value)}
                    />
                  </label>
                </div>

                <div>
                  <span className="form-label d-block mb-1">Email Address</span>
                  <p className="form-control-plaintext">{email}</p>
                  <div className="form-text">Email cannot be changed</div>
                </div>

                <Button type="submit" variant="primary" className="w-100">
                  Update Profile
                </Button>
              </form>
            </Card.Body>
          </Card>
        </Col>

        {/* Appearance */}

        <Col lg={6}>
          <Card className="border-0 shadow-sm fade-in h-100">
            <Card.Body>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="icon-chip">
                  <svg width="24" height="24" className="text-primary-emphasis" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21
                      5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                    />
                  </svg>
                </div>
                <h3 className="h5 m-0 text-dark">Appearance</h3>
              </div>

              <div className="vstack gap-2">
                <span className="form-label mb-1">Theme Preference</span>
                <Row className="g-2">
                  <Col xs={6}>
                    <Button
                      type="button"
                      id="lightTheme"
                      variant={theme === 'light' ? 'light' : 'outline-light'}
                      className="w-100 d-flex align-items-center justify-content-start gap-3"
                      onClick={() => setTheme('light')}
                      aria-pressed={theme === 'light'}
                    >
                      <span className="swatch swatch-light rounded-3 border" />
                      <span>Light</span>
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button
                      type="button"
                      id="darkTheme"
                      variant={theme === 'dark' ? 'secondary' : 'outline-secondary'}
                      className="w-100 d-flex align-items-center justify-content-start gap-3"
                      onClick={() => setTheme('dark')}
                      aria-pressed={theme === 'dark'}
                    >
                      <span className="swatch swatch-dark rounded-3" />
                      <span>Dark</span>
                    </Button>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Account Actions */}

        <Col lg={6}>
          <Card className="border-0 shadow-sm fade-in h-100">
            <Card.Body>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="icon-chip">
                  <svg width="24" height="24" className="text-warning" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94
                      3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724
                      0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924
                      1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724
                      1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0
                      001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="h5 m-0 text-dark">Account Actions</h3>
              </div>

              <Button
                type="button"
                variant="outline-danger"
                className="w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleSignOut}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Sign Out</span>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Settings;
