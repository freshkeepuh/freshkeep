'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { BoxArrowRight, Lock, Gear, BoxArrowInRight } from 'react-bootstrap-icons';
import { Role } from '@prisma/client';

const NavBar: React.FC = () => {
  const { data: session } = useSession();

  const pathName = usePathname();
  const isActive = (href: string) => pathName === href || (href !== '/' && pathName.startsWith(href));

  const offcanvasId = 'main-offcanvas';

  return (
    <Navbar data-testid="navbar" bg="success" expand="lg" data-bs-theme="dark">
      <Container>
        <Navbar.Brand data-testid="navbar-brand" as={Link} href="/" className="d-flex align-items-center">
          FreshKeep
        </Navbar.Brand>

        {/* Only show the links when signed in */}
        {session && <Navbar.Toggle data-testid="navbar-toggle" aria-controls={offcanvasId} />}

        {session ? (
          <Navbar.Offcanvas
            data-testid="navbar-offcanvas"
            id={offcanvasId}
            placement="end"
            style={{ backgroundColor: 'var(--bs-success)', color: 'white' }}
          >
            <Offcanvas.Header data-testid="navbar-offcanvas-header" closeButton closeVariant="white">
              <Offcanvas.Title data-testid="navbar-offcanvas-title">Menu</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body data-testid="navbar-offcanvas-body">
              {/* App links (only when logged in) */}
              <Nav className="ms-auto">
                <Nav.Link
                  data-testid="navbar-locations-link"
                  as={Link}
                  href="/locations"
                  active={isActive('/locations')}
                  style={{ color: 'white' }}
                >
                  Locations
                </Nav.Link>
                <Nav.Link
                  data-testid="navbar-shop-link"
                  as={Link}
                  href="/shop"
                  active={isActive('/shop')}
                  style={{ color: 'white' }}
                >
                  Shop
                </Nav.Link>
                <Nav.Link
                  data-testid="navbar-shopping-list-link"
                  as={Link}
                  href="/shoppingList"
                  active={isActive('/shoppingList')}
                  style={{ color: 'white' }}
                >
                  Shopping List
                </Nav.Link>
                <Nav.Link
                  data-testid="navbar-recipes-link"
                  as={Link}
                  href="/recipes"
                  active={isActive('/recipes')}
                  style={{ color: 'white' }}
                >
                  Recipes
                </Nav.Link>
                {(session.user?.role === Role.ADMIN) ? (
                  <Nav.Link
                    data-testid="navbar-users-link"
                    as={Link}
                    href="/users"
                    active={isActive('/users')}
                    style={{ color: 'white' }}
                  >
                    Users
                  </Nav.Link>
                ) : null}
              </Nav>

              {/* Account dropdown */}
              <Nav data-testid="navbar-account-dropdown" className="ms-auto">
                <NavDropdown
                  data-testid="navbar-dropdown-title"
                  title={session.user ? session.user.email : 'Account'}
                  align="end"
                >
                  <NavDropdown.Item data-testid="navbar-settings-link" as={Link} href="/settings">
                    <Gear className="me-2" />
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item data-testid="navbar-change-password-link" as={Link} href="/auth/change-password">
                    <Lock className="me-2" />
                    Change Password
                  </NavDropdown.Item>
                  <NavDropdown.Item data-testid="navbar-sign-out-link" onClick={() => signOut({ callbackUrl: '/' })}>
                    <BoxArrowRight className="me-2" />
                    Sign Out
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        ) : (
          // Signed out: only show Sign In
          <Nav className="ms-auto">
            <Nav.Link data-testid="navbar-sign-in-link" as={Link} href="/auth/signin" active={isActive('/auth/signin')}>
              <BoxArrowInRight className="me-2" />
              Sign In
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
