import React from "react";
import Footer from "../components/Global/Footer";
import Header from "../components/Header";
import { sanity, settingsQuery } from "../lib/sanity";
import PlausibleProvider from "next-plausible";
import CartProvider from "./cart-provider";
import ThemeProvider from "./chakra-provider";
import "./globals.css";
import Banner from "../components/Banner";
// import MailingList from "../components/Global/MailingList";
import Script from "next/script";
import SendPageView from "./SendPageView";
import AnalyticsScripts from "components/AnalyticsScripts";
import { useLoadScript } from "@shopify/hydrogen-react";

async function getData() {
  const res = await sanity.fetch(settingsQuery);

  if (!res) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res;
}

export const revalidate = 600;

declare global {
  interface Window {
    Tawk_API: any;
    fbq: any;
  }
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
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" />
        <PlausibleProvider domain="torsalonproducts.com" />
      </head>
      <ThemeProvider>
        <CartProvider>
          <SendPageView>
            <body>
              <Banner data={settings?.banner} />
              <Header menu={settings?.menu} />
              {children}
              <Footer />
              {/* <MailingList settings={settings?.emailPopup} /> */}
            </body>
          </SendPageView>
        </CartProvider>
      </ThemeProvider>
      <AnalyticsScripts />
      <Script
        id={"looxScript"}
        strategy="lazyOnload"
        src="https://loox.io/widget/loox.js?shop=tor-salon-products.myshopify.com"
      />
      <Script
        id={"klaviyoScript"}
        strategy="lazyOnload"
        src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=WbxSmN"
      />
    </html>
  );
}
