import React from "react";
import Footer from "../components/Global/Footer";
import Header from "../components/Header";
import { sanity, settingsQuery } from "../lib/sanity";
import PlausibleProvider from "next-plausible";
import CartProvider from "./cart-provider";
import ThemeProvider from "./chakra-provider";
import "./globals.css";
import Banner from "components/Banner";
import MailingList from "components/Global/MailingList";

async function getData() {
  const res = await sanity.fetch(settingsQuery);

  if (!res) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res;
}

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
            <Banner data={settings?.banner} />
            <Header menu={settings?.menu} />
            {children}
            <Footer />
            <MailingList settings={settings?.emailPopup} />
          </body>
        </CartProvider>
      </ThemeProvider>
    </html>
  );
}
