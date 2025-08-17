import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from './(components)/CartContext';
import Header from './(components)/Header';
import { ToastContainer } from './(components)/Toast';
import ErrorBoundary from './(components)/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce Store',
  description: 'Your one-stop shop for all your needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <CartProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <ToastContainer />
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
