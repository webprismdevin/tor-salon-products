import type { AppProps } from "next/app";
import { extendTheme, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { theme as defaultTheme, ThemeConfig } from '@chakra-ui/theme'
import Head from "next/head";
import TagManager from "react-gtm-module";
import { useEffect, useState } from "react";
import CartContext from "../lib/CartContext";
import ShopContext from "../lib/shop-context";
import Tawk from "../lib/tawk";
import "../styles/globals.css";
import { isMobile } from 'react-device-detect'
import dynamic from "next/dynamic";
import themeConfig from "../lib/theme";
import '@fontsource/raleway/400.css'
import Script from "next/script";

const NavBar = dynamic(() => import ("../components/NavBar"))
const Footer = dynamic(() => import ("../components/Footer"))

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

if (
  process.env.NODE_ENV === "production" && 
  process.browser
  ) {
    console.log("GTM fired");
    TagManager.initialize(tagManagerArgs);
} else {
    console.log("GTM not fired");
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
  }, [])

  return (
    <ChakraProvider theme={customTheme}>
      <ShopContext.Provider value={{ shop }}>
        <Head>
          <meta name="theme-color" content="rgba(36,36,36)" />
        </Head>
        <CartContext.Provider value={{ cart, setCart }}>
          <NavBar isMobile={isMobile} />
          <Component {...pageProps} />
        </CartContext.Provider>
        <Footer />
      </ShopContext.Provider>
      <ColorModeScript initialColorMode={customTheme.initialColorMode} />
      <Tawk src="https://embed.tawk.to/622337bb1ffac05b1d7d1403/1ftcp3dfu" />
      <Script 
        strategy="afterInteractive"
        id="mcjs"
        dangerouslySetInnerHTML={{
          __html: `!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/566702352818277eb55d3447b/a2735d6d81be9c69df471f6fb.js");`
        }}
      />
    </ChakraProvider>
  );
}

export default MyApp;