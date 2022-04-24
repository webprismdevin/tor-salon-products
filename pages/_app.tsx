import type { AppProps } from "next/app";
import { extendTheme, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
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


const NavBar = dynamic(() => import("../components/NavBar"));
const Footer = dynamic(() => import("../components/Footer"));
const Tawk = dynamic(() => import("../lib/tawk"))

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
  console.log("GTM fired");
  TagManager.initialize(tagManagerArgs);
} 
if(process.env.NODE_ENV === "development" && process.browser) {
  console.log("GTM not fired");

  // console.log("GTM fired");
  // TagManager.initialize(tagManagerArgs);
}

function MyApp({ Component, pageProps }: AppProps) {
  const [cart, setCart] = useState<any>({ id: null, lines: [] });
  const shop = {
    name: "TOR Salon Products",
  };

  useEffect(() => {
    if (process.browser) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.customStyle = {
        zIndex: 1000,
      };
    }
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
      <ShopContext.Provider value={{ shop }}>
        <Head>
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <CartContext.Provider value={{ cart, setCart }}>
          <NavBar />
          <Component {...pageProps} />
        </CartContext.Provider>
        <Footer />
      </ShopContext.Provider>
      <ColorModeScript initialColorMode={customTheme.initialColorMode} />
      <Tawk src="https://embed.tawk.to/622337bb1ffac05b1d7d1403/1ftcp3dfu" />
      <MailingList />
    </ChakraProvider>
  );
}

export default MyApp;
