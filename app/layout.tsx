import Footer from "components/Global/Footer";
import Header from "components/Header";
import { sanity, settingsQuery } from "lib/sanity";
import { Metadata } from "next";
import PlausibleProvider from "next-plausible";
import CartProvider from "./cart-provider";
import ThemeProvider from "./chakra-provider";
import "./globals.css";

export async function getData() {
  const res = await sanity.fetch(settingsQuery);

  if (!res) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res;
}

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getData();

  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="torsalonproducts.com" />
      </head>
      <ThemeProvider>
        <CartProvider>
          <body>
            <Header menu={settings?.menu} />
            {children}
            <Footer />
          </body>
        </CartProvider>
      </ThemeProvider>
    </html>
  );
}
