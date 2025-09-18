'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './settings.css';

export default function UserSettingsPage(): JSX.Element {
  const router = useRouter();

  // default state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [name, setName] = useState<string>('');
  const [email] = useState<string>('');

  // apply/remove body class for dark
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const { body } = document;
    body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const onSubmitProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Profile submitted:', { name, email });
  };

  const signOut = () => {
    console.log('Signing out…');
    router.push('/auth');
  };

  return (
    <div className="fk-bg" id="body">
      <main className="container py-4 py-md-5">
        {/* Title */}
        <section className="mb-4 mb-md-5 fade-in">
          <h2 className="fw-bold fs-3 text-dark mb-1">User Settings</h2>
          <p className="text-muted m-0">Manage your account preferences and settings</p>
        </section>

        <div className="row g-4">
          {/* === Profile Settings Slot === */}
          <div className="col-lg-6">
            <section className="card border-0 shadow-sm fade-in h-100">
              <div className="card-body">
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

                <form id="profileForm" className="vstack gap-3" noValidate onSubmit={onSubmitProfile}>
                  <div>
                    <label htmlFor="userName" className="form-label w-100">
                      <span className="d-block mb-1">Full Name</span>
                      <input
                        type="text"
                        id="userName"
                        className="form-control"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </label>
                  </div>
                  <div>
                    <span className="form-label d-block mb-1">Email Address</span>
                    <p className="form-control-plaintext">{email}</p>
                    <div className="form-text">Email cannot be changed</div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Update Profile
                  </button>
                </form>
              </div>
            </section>
          </div>

          {/* Theme Settings */}
          <div className="col-lg-6">
            <section className="card border-0 shadow-sm fade-in h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="icon-chip">
                    <svg width="24" height="24" className="text-primary-emphasis" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0
                        00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="h5 m-0 text-dark">Appearance</h3>
                </div>

                <div className="vstack gap-2">
                  <span className="form-label mb-1">Theme Preference</span>

                  <div className="row g-2">
                    <div className="col-6">
                      <button
                        type="button"
                        id="lightTheme"
                        className="w-100 btn btn-outline-success d-flex align-items-center justify-content-start gap-3"
                        onClick={() => setTheme('light')}
                        aria-pressed={theme === 'light'}
                      >
                        <span className="swatch swatch-light rounded-3 border" />
                        <span>Light</span>
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        id="darkTheme"
                        className="w-100 btn btn-outline-secondary d-flex align-items-center
                        justify-content-start gap-3"
                        onClick={() => setTheme('dark')}
                        aria-pressed={theme === 'dark'}
                      >
                        <span className="swatch swatch-dark rounded-3" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Account Actions */}
          <div className="col-lg-6">
            <section className="card border-0 shadow-sm fade-in h-100">
              <div className="card-body">
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

                <button
                  type="button"
                  className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={signOut}
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
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
