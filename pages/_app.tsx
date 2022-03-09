import type { AppProps } from "next/app";
import { extendTheme, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Head from "next/head";
import { useState } from "react";
import CartContext from "../lib/CartContext";
import ShopContext from "../lib/shop-context";
import Tawk from "../lib/tawk";
import "../styles/globals.css";
import Script from "next/script";
import { isMobile } from 'react-device-detect'

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
        id="segment"
        dangerouslySetInnerHTML={{
          __html: `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="9oXv6Mb4kXfVnuHfwVFC0qeVq1GUCNs2";;analytics.SNIPPET_VERSION="4.15.3";
          analytics.load("9oXv6Mb4kXfVnuHfwVFC0qeVq1GUCNs2");
          analytics.page();
          }}();`,
        }}
      />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-54F8GD7JSQ"
        //@ts-ignore
        onLoad={() => {window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-54F8GD7JSQ');}}
      />
    </ChakraProvider>
  );
}

export default MyApp;