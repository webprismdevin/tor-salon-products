import type { AppProps } from "next/app";
import { extendTheme, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import CartContext from "../lib/CartContext";
import ShopContext from "../lib/shop-context";
import Tawk from "../lib/tawk";
import "../styles/globals.css";
import Script from "next/script";
import { isMobile } from 'react-device-detect'
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import ("../components/NavBar"))
const Footer = dynamic(() => import ("../components/Footer"))


const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
};

const customTheme = extendTheme({ config });

function MyApp({ Component, pageProps }: AppProps) {
  const [cart, setCart] = useState<any>({ id: null, lines: [] });
  const shop = {
    name: "TOR Salon Products",
  };

  useEffect(() => {
    console.log(isMobile, "from app")
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
        strategy="lazyOnload"
        id="yotpo reviews"
        dangerouslySetInnerHTML={{
          __html: `(function e(){var e=document.createElement("script");e.type="text/javascript",e.async=true,e.src="//staticw2.yotpo.com/bz5Tc1enx8u57VXYMgErAGV7J82jXdFXoIImJx6l/widget.js";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();`,
        }}
      />
      <Script
        id="GA4"
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-L3HEMBXVC3"
        //@ts-ignore
        onLoad={() => {window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-L3HEMBXVC3');}}
      />
    </ChakraProvider>
  );
}

export default MyApp;