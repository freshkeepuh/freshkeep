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
    <Navbar
      data-testid="navbar"
      bg="success"
      expand="lg"
      data-bs-theme="dark"
    >
      <Container>
        <Navbar.Brand
          data-testid="navbar-brand"
          as={Link}
          href="/"
          className="d-flex align-items-center"
        >
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
              <Nav data-testid="navbar-nav" className="ms-auto">
                <Nav.Link
                  data-testid="navbar-link-locations"
                  as={Link}
                  href="/locations"
                  active={isActive('/locations')}
                  style={{ color: 'white' }}
                >
                  Locations
                </Nav.Link>
                <Nav.Link
                  data-testid="navbar-link-catalog"
                  as={Link}
                  href="/catalog"
                  active={isActive('/shop')}
                  style={{ color: 'white' }}
                >
                  Catalog
                </Nav.Link>
                <Nav.Link
                  data-testid="navbar-link-shopping-list"
                  as={Link}
                  href="/shoppingList"
                  active={isActive('/shoppingList')}
                  style={{ color: 'white' }}
                >
                  Shopping List
                </Nav.Link>
                <Nav.Link
                  data-testid="navbar-link-stores"
                  as={Link}
                  href="/stores"
                  active={isActive('/stores')}
                  style={{ color: 'white' }}
                >
                  Stores
                </Nav.Link>
                <Nav.Link
                  data-testid="navbar-link-recipes"
                  as={Link}
                  href="/recipes"
                  active={isActive('/recipes')}
                  style={{ color: 'white' }}
                >
                  Recipes
                </Nav.Link>
              </Nav>

              {/* Account dropdown */}
              <Nav>
                <NavDropdown data-testid="navbar-dropdown-account" title={currentUser} align="end">
                  <NavDropdown.Item data-testid="navbar-link-settings" as={Link} href="/settings">
                    <Gear className="me-2" />
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item data-testid="navbar-link-change-password" as={Link} href="/auth/change-password">
                    <Lock className="me-2" />
                    Change Password
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    data-testid="navbar-link-signout"
                    onClick={() => signOut({
                      callbackUrl: `${window.location.origin}/`,
                      redirect: true,
                    })}
                  >
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
            <Nav.Link data-testid="navbar-link-signin" as={Link} href="/auth/signin" active={isActive('/auth/signin')}>
              Sign In
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
