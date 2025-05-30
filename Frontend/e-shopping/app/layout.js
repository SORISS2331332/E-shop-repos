"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./styles/style.scss";
import Header from './components/Header';
import Footer from "./components/Footer";
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from "./context/CartContext";
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import { SessionProvider } from "next-auth/react";

import 'bootstrap-icons/font/bootstrap-icons.css';
import OAuthSyncer from "./context/OAuthSyncer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: 'E-SHOP',
//   description: 'La boutique ultime',
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const params = useParams();
  const idArticle = params?.id;

  // Liste des pages sans header/footer
  const pagesSansHeaderFooter = ['/connexion', '/inscription', '/admin', '/admin/ajout', `/admin/modifier/${idArticle}`, '/admin/articles', '/admin/userAdmin'];

  const afficherHeaderFooter = !pagesSansHeaderFooter.includes(pathname);

  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <AuthProvider>
            <CartProvider>
              <OAuthSyncer />
              {afficherHeaderFooter && <Header />}
              {children}
              {afficherHeaderFooter && <Footer />}
            </CartProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
