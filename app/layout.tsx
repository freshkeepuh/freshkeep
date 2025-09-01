import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshKeep",
  description: "A modern web application for managing your pantry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Define header style
  const headerStyle: React.CSSProperties = {
    color: "#000",
    background: "#e5e5e5",
    padding: "1rem",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
  };

  // Define main style
  const mainStyle: React.CSSProperties = {
    minHeight: "80vh",
    padding: "2rem",
    background: "#f5f5f5",
  };

  // Define footer style
  const footerStyle: React.CSSProperties = {
    background: "#000",
    padding: "1rem",
    textAlign: "center",
    borderTop: "1px solid #ddd",
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Header */}
        <header style={headerStyle}>
          <nav style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
            <a href="/"><Image
              src="/home.svg"
              alt="Home"
              width={20}
              height={20}
            /></a>
          </nav>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "row", alignItems: "center" }}><h1>FreshKeep</h1></div>
          <nav style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <a href="/"><Image
              src="/profile.svg"
              alt="Profile"
              width={20}
              height={20}
            /></a>
          </nav>
        </header>

        {/* Main Content */}
        <main style={mainStyle}>{children}</main>

        {/* Footer */}
        <footer style={footerStyle}>
          <div style={{ textAlign: "left", display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
            <a href="https://github.com/freshkeepuh/freshkeep">Source Code</a>
          </div>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "row", alignItems: "center" }}>
            <p>&copy; 2025 FreshKeep UH. All rights reserved.</p>
          </div>
          <div style={{ textAlign: "right", display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
            <a href="https://freshkeepuh.github.io">About Us</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
