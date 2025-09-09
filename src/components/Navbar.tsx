// /* eslint-disable react/jsx-indent, @typescript-eslint/indent */

// 'use client';

// import { useEffect, useState } from 'react';
// import { usePathname } from 'next/navigation';
// import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
// import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
// import type { User } from '@supabase/supabase-js';
// import { createClient } from '@/lib/supabase/createClient';

// const NavBar: React.FC = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const supabase = createClient();
//   const pathName = usePathname();

//   useEffect(() => {
//     // Get initial user
//     const getUser = async () => {
//       const {
//         data: { user: currentUser },
//       } = await supabase.auth.getUser();
//       setUser(currentUser);

//       // If user exists, get their role from your database
//       if (currentUser) {
//         // You'll need to query your User table to get the role
//         // This assumes you have a users table with role field
//         const { data: userData } = await supabase
//           .from('User') // or whatever your table name is
//           .select('role')
//           .eq('email', currentUser.email)
//           .single();

//         setUserRole(userData?.role || 'USER');
//       }
//     };

//     getUser();

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       setUser(session?.user ?? null);

//       if (session?.user) {
//         // Get role when user signs in
//         const { data: userData } = await supabase.from('User').select('role').eq('email', session.user.email).single();

//         setUserRole(userData?.role || 'USER');
//       } else {
//         setUserRole(null);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [supabase]);

//   const handleSignOut = async () => {
//     try {
//       // Clear local state first
//       setUser(null);
//       setUserRole(null);

//       // Sign out from Supabase
//       await supabase.auth.signOut();

//       // Force redirect with reload
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Error signing out:', error);
//       // Force reload even on error
//       window.location.reload();
//     }
//   };
//   const handleFreshLogin = async () => {
//     await supabase.auth.signOut();
//     window.location.href = '/sbAuthTest/signin';
//   };

//   return (
//     <Navbar bg="light" expand="lg">
//       <Container>
//         <Navbar.Brand href="/">Next.js Application Template</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto justify-content-start">
//             {user
//               ? [
//                   <Nav.Link id="add-stuff-nav" href="/add" key="add" active={pathName === '/add'}>
//                     Add Stuff
//                   </Nav.Link>,
//                   <Nav.Link id="list-stuff-nav" href="/list" key="list" active={pathName === '/list'}>
//                     List Stuff
//                   </Nav.Link>,
//                 ]
//               : ''}
//             {user && userRole === 'ADMIN' ? (
//               <Nav.Link id="admin-stuff-nav" href="/admin" key="admin" active={pathName === '/admin'}>
//                 Admin
//               </Nav.Link>
//             ) : (
//               ''
//             )}
//           </Nav>
//           <Nav>
//             {user ? (
//               <NavDropdown id="login-dropdown" title={user.email}>
//                 <NavDropdown.Item id="login-dropdown-sign-out" onClick={handleSignOut}>
//                   <BoxArrowRight />
//                   Sign Out
//                 </NavDropdown.Item>
//                 <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
//                   <Lock />
//                   Change Password
//                 </NavDropdown.Item>
//               </NavDropdown>
//             ) : (
//               <NavDropdown id="login-dropdown" title="Login">
//                 <NavDropdown.Item id="login-dropdown-sign-in" onClick={handleFreshLogin}>
//                   <PersonFill />
//                   Sign in
//                 </NavDropdown.Item>
//                 <NavDropdown.Item id="login-dropdown-sign-up" href="/sbAuthTest/signup">
//                   <PersonPlusFill />
//                   Sign up
//                 </NavDropdown.Item>
//               </NavDropdown>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavBar;
/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/createClient';

const NavBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();
  const pathName = usePathname();

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);

      // If user exists, get their role from your database
      if (currentUser) {
        // You'll need to query your User table to get the role
        // This assumes you have a users table with role field
        const { data: userData } = await supabase
          .from('User') // or whatever your table name is
          .select('role')
          .eq('email', currentUser.email)
          .single();

        setUserRole(userData?.role || 'USER');
      }
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        // Get role when user signs in
        const { data: userData } = await supabase.from('User').select('role').eq('email', session.user.email).single();

        setUserRole(userData?.role || 'USER');
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      // Clear local state first
      setUser(null);
      setUserRole(null);

      // Sign out from Supabase
      await supabase.auth.signOut();

      // Force redirect with reload
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Force reload even on error
      window.location.reload();
    }
  };
  const handleFreshLogin = async () => {
    await supabase.auth.signOut();
    window.location.href = '/sbAuthTest/signin';
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Next.js Application Template</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {user
              ? [
                  <Nav.Link id="add-stuff-nav" href="/addStuff" key="add" active={pathName === '/add'}>
                    Add Stuff
                  </Nav.Link>,
                  <Nav.Link id="list-stuff-nav" href="/list" key="list" active={pathName === '/list'}>
                    List Stuff
                  </Nav.Link>,
                ]
              : ''}
            {user && userRole === 'ADMIN' ? (
              <Nav.Link id="admin-stuff-nav" href="/admin" key="admin" active={pathName === '/admin'}>
                Admin
              </Nav.Link>
            ) : (
              ''
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown id="login-dropdown" title={user.email}>
                <NavDropdown.Item id="login-dropdown-sign-out" onClick={handleSignOut}>
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" onClick={handleFreshLogin}>
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/sbAuthTest/signup">
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
