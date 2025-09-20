'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock } from 'react-bootstrap-icons';

// TODO: custom colors https://getbootstrap.com/docs/5.3/customize/color-modes/
const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const pathName = usePathname();
  return (
    <Navbar bg="success" expand="lg" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">FreshKeep</Navbar.Brand>
        <Nav>
          {session && <Navbar.Toggle aria-controls="basic-navbar-nav" />}
          {session ? (
            <Navbar.Collapse id="basic-navbar-nav">
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  {' '}
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          ) : (
            <Nav.Link
              id="login-dropdown-sign-in"
              title="Login"
              href="/auth/signin"
              active={pathName === '/auth/signin'}
            >
              Sign In
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
