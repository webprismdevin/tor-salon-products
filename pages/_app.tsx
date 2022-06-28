import type { AppProps } from "next/app";
import {
  extendTheme,
  ChakraProvider,
  ColorModeScript,
  Box,
} from "@chakra-ui/react";
import { theme as defaultTheme, ThemeConfig } from "@chakra-ui/theme";
import { Suspense, useEffect, useState } from "react";
import CartContext from "../lib/CartContext";
import ShopContext from "../lib/shop-context";
import Head from "next/head";
import dynamic from "next/dynamic";
import themeConfig from "../lib/theme";
import MailingList from "../components/MailingList";
import "@fontsource/raleway/400.css";
import "../styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import AuthContext from "../lib/auth-context";
import useUser from "../lib/useUser";

const Banner = dynamic(() => import("../components/Banner"));
const NavBar = dynamic(() => import("../components/NavBar"), { suspense: true});
const Tawk = dynamic(() => import("../lib/tawk"), { ssr: false });
const Follow = dynamic(() => import("../components/Follow"), { ssr: false });
const Footer = dynamic(() => import("../components/Footer"));

declare global {
  interface Window {
    Tawk_API: any;
    dataLayer: any;
  }
}

const customTheme: ThemeConfig = extendTheme(defaultTheme, themeConfig);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [cart, setCart] = useState<any>({ id: null, lines: [] });
  const shop = { name: "TOR Salon Products" };
  const [user, setUser, token, setToken] = useUser();

  useEffect(() => {
    if (typeof window) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.customStyle = {
        zIndex: 199,
      };
    }
  }, []);

  return (
    <>
      <ChakraProvider theme={customTheme}>
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
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
              {router.pathname !== "/wholesale" && !router.asPath.includes("/offer") && <Banner />}
              <Suspense fallback={`...`}>
                <NavBar />
              </Suspense>
              <Component key={router.asPath} {...pageProps} />
            </CartContext.Provider>
            {!router.asPath.includes("/offer") && <Follow />}
            {!router.asPath.includes("/offer") && <Footer />}
          </ShopContext.Provider>
        </AuthContext.Provider>
        <ColorModeScript initialColorMode={customTheme.initialColorMode} />
        {process.env.NODE_ENV === "production" && !router.asPath.includes("/offer") && (
          <>
            <Tawk src="https://embed.tawk.to/622337bb1ffac05b1d7d1403/1ftcp3dfu" />
          </>
        )}
        {process.env.NODE_ENV === "production" &&
          !router.asPath.includes("/offer") && <MailingList />}
      </ChakraProvider>
      {process.env.NODE_ENV === "production" && (
        <Script
          id="tagManager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://gtm.torsalonproducts.com/kthlknzv.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MKG7C6H');`,
          }}
        />
      )}
      <Script src="https://dttrk.com/shopify/track.js?shop=tor-salon-products.myshopify.com" />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img src="//api.yotpo.com/conversion_tracking.gif?app_key=bz5Tc1enx8u57VXYMgErAGV7J82jXdFXoIImJx6l&order_id={{order_name|handleize}}&order_amount={{subtotal_price|money_without_currency}}&order_currency={{ shop.currency }}" width="1" height="1" />`,
        }}
      />
      {process.env.NODE_ENV === "production" && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://gtm.torsalonproducts.com/ns.html?id=GTM-MKG7C6H"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
      )}
    </>
  );
}

export default MyApp;
