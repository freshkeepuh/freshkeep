import type { Metadata } from 'next';
import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'FreshKeep',
  description: 'Fresh food with you',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="wrapper">
        <Providers>
          <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <main className="flex-grow-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
