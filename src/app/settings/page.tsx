'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Toast, ToastContainer } from 'react-bootstrap';
import './settings.css';

type Theme = 'light' | 'dark';

export default function SettingsPage(): JSX.Element {
  const router = useRouter();

  // basic state
  const [theme, setTheme] = useState<Theme>('light');
  const [name, setName] = useState('John Doe');
  const [email] = useState('john.doe@example.com');
  const [logoError, setLogoError] = useState(false);

  // toast state
  const [toastMsg, setToastMsg] = useState('Success');
  const [toastKind, setToastKind] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);

  // modal state
  const [showReset, setShowReset] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  // keep a body class for dark mode
  useEffect(() => {
    const { body } = document;
    if (theme === 'dark') body.classList.add('dark');
    else body.classList.remove('dark');
  }, [theme]);

  // small helper for toasts
  const notify = (msg: string, kind: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastKind(kind);
    setShowToast(true);
  };

  // form handlers
  const onSubmitProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      notify('Please enter your name', 'error');
      return;
    }
    // TODO: PATCH /api/users/me
    notify('Profile updated successfully!', 'success');
  };

  const onSubmitPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const current = String(data.get('currentPassword') ?? '');
    const newPass = String(data.get('newPassword') ?? '');
    const confirm = String(data.get('confirmPassword') ?? '');

    if (!current || !newPass || !confirm) {
      notify('Please fill in all password fields', 'error');
      return;
    }
    if (newPass !== confirm) {
      notify('New passwords do not match', 'error');
      return;
    }
    if (newPass.length < 6) {
      notify('Password must be at least 6 characters', 'error');
      return;
    }

    e.currentTarget.reset();
    // TODO: POST /api/users/password
    notify('Password changed successfully!', 'success');
  };

  // account actions
  const exportData = () => {
    // TODO: start real export
    notify('Data export started! Check your downloads.', 'success');
  };

  const confirmReset = () => {
    // TODO: backend reset + cache clear
    setShowReset(false);
    notify('Account data has been reset', 'success');
  };

  const confirmSignOut = () => {
    // TODO: clear auth + redirect
    setShowSignOut(false);
    notify('Signing out...', 'success');
    setTimeout(() => router.push('/auth'), 900);
  };

  const goBack = () => {
    notify('Returning to dashboard...', 'success');
    router.push('/dashboard');
  };

  return (
    <div className="fk-bg">
      {/* ===== header ===== */}
      <header className="bg-white border-bottom shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-4 overflow-hidden d-flex align-items-center
                           justify-content-center"
                style={{ width: 40, height: 40 }}
              >
                {!logoError ? (
                  <Image
                    src="/logo.png"
                    alt="FRESHKEEP Logo"
                    width={40}
                    height={40}
                    onError={() => setLogoError(true)}
                    style={{ objectFit: 'cover', borderRadius: 12 }}
                    priority
                  />
                ) : (
                  <div className="logo-fallback d-flex">
                    <span className="small">FK</span>
                  </div>
                )}
              </div>

              <h1 className="h4 m-0 text-dark">FRESHKEEP</h1>
            </div>

            <div className="d-flex align-items-center gap-3">
              <Button
                type="button"
                variant="outline-secondary"
                className="p-2"
                aria-label="Go back"
                onClick={goBack}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Button>

              <div
                className="rounded-4 d-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                  backgroundImage: 'linear-gradient(90deg,#22c55e,#3b82f6)',
                }}
                aria-hidden="true"
              >
                <svg
                  width="24"
                  height="24"
                  className="text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7
                       7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== content ===== */}
      <main className="container py-4 py-md-5">
        <section className="mb-4 mb-md-5 fade-in">
          <h2 className="fw-bold fs-3 text-dark mb-1">User Settings</h2>
          <p className="text-muted m-0">
            Manage your account preferences and settings
          </p>
        </section>

        <div className="row g-4">
          {/* profile */}
          <div className="col-lg-6">
            <section className="card border-0 shadow-sm fade-in h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="rounded-4 d-flex align-items-center
                               justify-content-center bg-primary-subtle"
                    style={{ width: 48, height: 48 }}
                  >
                    <svg
                      width="24"
                      height="24"
                      className="text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7
                           7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="h5 m-0 text-dark">Profile Information</h3>
                </div>

                <form
                  id="profileForm"
                  className="vstack gap-3"
                  onSubmit={onSubmitProfile}
                  noValidate
                >
                  <div>
                    <p className="form-label mb-1">Full Name</p>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your full name"
                      aria-label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <p className="form-label mb-1">Email Address</p>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="your.email@example.com"
                      aria-label="Email Address"
                      value={email}
                      readOnly
                    />
                    <div className="form-text">Email cannot be changed</div>
                  </div>

                  <Button type="submit" className="btn-gradient w-100">
                    Update Profile
                  </Button>
                </form>
              </div>
            </section>
          </div>

          {/* security */}
          <div className="col-lg-6">
            <section className="card border-0 shadow-sm fade-in h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="rounded-4 d-flex align-items-center
                               justify-content-center bg-danger-subtle"
                    style={{ width: 48, height: 48 }}
                  >
                    <svg
                      width="24"
                      height="24"
                      className="text-danger"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2
                           2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="h5 m-0 text-dark">Security</h3>
                </div>

                <form
                  id="passwordForm"
                  className="vstack gap-3"
                  onSubmit={onSubmitPassword}
                  noValidate
                >
                  <div>
                    <p className="form-label mb-1">Current Password</p>
                    <input
                      name="currentPassword"
                      type="password"
                      className="form-control"
                      placeholder="Enter current password"
                      aria-label="Current Password"
                    />
                  </div>

                  <div>
                    <p className="form-label mb-1">New Password</p>
                    <input
                      name="newPassword"
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                      aria-label="New Password"
                    />
                  </div>

                  <div>
                    <p className="form-label mb-1">Confirm New Password</p>
                    <input
                      name="confirmPassword"
                      type="password"
                      className="form-control"
                      placeholder="Confirm new password"
                      aria-label="Confirm New Password"
                    />
                  </div>

                  <Button type="submit" variant="danger" className="w-100">
                    Change Password
                  </Button>
                </form>
              </div>
            </section>
          </div>

          {/* appearance */}
          <div className="col-lg-6">
            <section className="card border-0 shadow-sm fade-in h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="rounded-4 d-flex align-items-center
                               justify-content-center"
                    style={{ width: 48, height: 48, background: '#f3e8ff' }}
                  >
                    <svg
                      width="24"
                      height="24"
                      className="text-primary-emphasis"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012
                           2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2
                           2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="h5 m-0 text-dark">Appearance</h3>
                </div>

                <div className="vstack gap-2">
                  <p className="form-label mb-1">Theme Preference</p>

                  <div className="row g-2">
                    <div className="col-6">
                      <Button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={
                          theme === 'light'
                            ? 'w-100 btn-success d-flex align-items-center gap-3'
                            : 'w-100 btn-outline-secondary d-flex align-items-center gap-3'
                        }
                        aria-pressed={theme === 'light'}
                        aria-label="Use light theme"
                      >
                        <span
                          className="rounded-3 border"
                          style={{
                            width: 32,
                            height: 32,
                            background:
                              'linear-gradient(135deg,#ecfdf5,#eff6ff)',
                          }}
                        />
                        <span>Light</span>
                      </Button>
                    </div>

                    <div className="col-6">
                      <Button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={
                          theme === 'dark'
                            ? 'w-100 btn-success d-flex align-items-center gap-3'
                            : 'w-100 btn-outline-secondary d-flex align-items-center gap-3'
                        }
                        aria-pressed={theme === 'dark'}
                        aria-label="Use dark theme"
                      >
                        <span
                          className="rounded-3"
                          style={{
                            width: 32,
                            height: 32,
                            background:
                              'linear-gradient(135deg,#1f2937,#111827)',
                          }}
                        />
                        <span>Dark</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* account actions */}
          <div className="col-lg-6">
            <section className="card border-0 shadow-sm fade-in h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div
                    className="rounded-4 d-flex align-items-center
                               justify-content-center bg-warning-subtle"
                    style={{ width: 48, height: 48 }}
                  >
                    <svg
                      width="24"
                      height="24"
                      className="text-warning"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724
                           0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724
                           1.724 0 001.065 2.572c1.756.426 1.756 2.924 0
                           3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826
                           3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426
                           1.756-2.924 1.756-3.35 0a1.724 1.724 0
                           00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724
                           1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35
                           a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31
                           2.37-2.37.996.608 2.296.07 2.572-1.065z"
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

                <div className="vstack gap-2">
                  <Button
                    type="button"
                    variant="outline-primary"
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={exportData}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2
                           2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1
                           1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Export Data</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline-warning"
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setShowReset(true)}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0
                           0H9m11 11v-5h-.581m0 0a8.003 8.003 0
                           01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Reset All Data</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline-danger"
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setShowSignOut(true)}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3
                           3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013
                           3v1"
                      />
                    </svg>
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ===== toast ===== */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastKind === 'error' ? 'danger' : 'success'}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* ===== reset modal ===== */}
      <Modal show={showReset} onHide={() => setShowReset(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Reset all data?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReset(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={confirmReset}>
            Yes, reset
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===== sign out modal ===== */}
      <Modal show={showSignOut} onHide={() => setShowSignOut(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Sign out?</Modal.Title>
        </Modal.Header>
        <Modal.Body>You will be redirected to the login page.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSignOut(false)}>
            Stay
          </Button>
          <Button variant="danger" onClick={confirmSignOut}>
            Sign out
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
