'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Offcanvas } from 'react-bootstrap';
import { BoxArrowRight, Lock, Gear } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email ?? 'Account';
  const pathName = usePathname();
  const isActive = (href: string) => pathName === href || (href !== '/' && pathName.startsWith(href));

  const offcanvasId = 'main-offcanvas';

  return (
    <Navbar bg="success" expand="lg" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} href="/" className="d-flex align-items-center">
          FreshKeep
        </Navbar.Brand>

        {/* Only show the links when signed in */}
        {session && <Navbar.Toggle aria-controls={offcanvasId} />}

        {session ? (
          <Navbar.Offcanvas
            id={offcanvasId}
            placement="end"
            style={{ backgroundColor: 'var(--bs-success)', color: 'white' }}
          >
            <Offcanvas.Header closeButton closeVariant="white">
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              {/* App links (only when logged in) */}
              <Nav className="ms-auto">
                <Nav.Link as={Link} href="/locations" active={isActive('/locations')} style={{ color: 'white' }}>
                  Locations
                </Nav.Link>
                <Nav.Link as={Link} href="/shop" active={isActive('/shop')} style={{ color: 'white' }}>
                  Shop
                </Nav.Link>
                <Nav.Link as={Link} href="/shoppingList" active={isActive('/shoppingList')} style={{ color: 'white' }}>
                  Shopping List
                </Nav.Link>
                <Nav.Link as={Link} href="/recipes" active={isActive('/recipes')} style={{ color: 'white' }}>
                  Recipes
                </Nav.Link>
              </Nav>

              {/* Account dropdown */}
              <Nav>
                <NavDropdown title={currentUser} align="end">
                  <NavDropdown.Item as={Link} href="/settings">
                    <Gear className="me-2" />
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} href="/auth/change-password">
                    <Lock className="me-2" />
                    Change Password
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => signOut({ callbackUrl: '/' })}>
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
            <Nav.Link as={Link} href="/auth/signin" active={isActive('/auth/signin')}>
              Sign In
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
