import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./(components)/CartContext";
import { ToastContainer } from "./(components)/Toast";
import Header from "./(components)/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcomStore - Your Online Shopping Destination",
  description: "Discover amazing products at great prices. Shop online with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Header />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
