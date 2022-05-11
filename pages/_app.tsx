import type { AppProps } from "next/app";
import {
  extendTheme,
  ChakraProvider,
  ColorModeScript,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { theme as defaultTheme, ThemeConfig } from "@chakra-ui/theme";
import { useEffect, useState } from "react";
import CartContext from "../lib/CartContext";
import ShopContext from "../lib/shop-context";
import Head from "next/head";
import TagManager from "react-gtm-module";
import dynamic from "next/dynamic";
import themeConfig from "../lib/theme";
import MailingList from "../components/MailingList";
import "@fontsource/raleway/400.css";
import "../styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import * as fbq from "../lib/fpixel";
import Follow from "../components/Follow";

const NavBar = dynamic(() => import("../components/NavBar"));
const Footer = dynamic(() => import("../components/Footer"));
const Tawk = dynamic(() => import("../lib/tawk"));

declare global {
  interface Window {
    Tawk_API: any;
    dataLayer: any;
  }
}

const customTheme: ThemeConfig = extendTheme(defaultTheme, themeConfig);

const tagManagerArgs = {
  gtmId: "GTM-MKG7C6H",
};

if (process.env.NODE_ENV === "production" && process.browser) {
  console.log("GTM in production");
  TagManager.initialize(tagManagerArgs);
}
// if (process.env.NODE_ENV === "development" && process.browser) {
//   console.log("GTM in development");
//   TagManager.initialize(tagManagerArgs);
// }

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [cart, setCart] = useState<any>({ id: null, lines: [] });
  const shop = {
    name: "TOR Salon Products",
  };

  useEffect(() => {
    if (typeof window) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.customStyle = {
        zIndex: 199,
      };
    }
  }, []);

  useEffect(() => {
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    fbq.pageview();

    const handleRouteChange = () => {
      fbq.pageview();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
    <ChakraProvider theme={customTheme}>
      <ShopContext.Provider value={{ shop }}>
        <Head>
          <meta name="theme-color" content="#ffffff" />
          <link rel="shortcut icon" href="/favicon.png" />
          <meta
            name="facebook-domain-verification"
            content="bk02y72cdwvcwzina508gmb7xv87g6"
          />
        </Head>
        <CartContext.Provider value={{ cart, setCart }}>
          <NavBar />
          <Component {...pageProps} />
        </CartContext.Provider>
        <Follow />
        <Footer />
      </ShopContext.Provider>
      <ColorModeScript initialColorMode={customTheme.initialColorMode} />
      {process.env.NODE_ENV === "production" && (
        <>
          <Tawk src="https://embed.tawk.to/622337bb1ffac05b1d7d1403/1ftcp3dfu" />
        </>
      )}
      {process.env.NODE_ENV === "production" && (
        <>
          <MailingList />
        </>
      )}
    </ChakraProvider>
      <Script
      id="fb_pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', ${fbq.FB_PIXEL_ID});
        fbq('track', 'PageView');`,
      }}
    />
    </>
  );
}

export default MyApp;
