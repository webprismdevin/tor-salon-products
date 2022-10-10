import type { AppProps } from "next/app";
import { extendTheme, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import CartContext from "../lib/CartContext";
import ShopContext from "../lib/shop-context";
import Head from "next/head";
import dynamic from "next/dynamic";
import themeConfig from "../lib/theme";
import AuthContext from "../lib/auth-context";
import useUser from "../lib/useUser";
import Loader from "../components/Loader";
import Script from "next/script";
import { theme as defaultTheme, ThemeConfig } from "@chakra-ui/theme";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import "@fontsource/raleway/400.css";
import "../styles/globals.css";
import { sanity } from "../lib/sanity";
import useSWR from "swr";

const Banner = dynamic(() => import("../components/Global/Banner"));
const Navigation = dynamic(() => import("../components/Global/Navigation"))
const Follow = dynamic(() => import("../components/Global/Follow"), {
  ssr: false,
});
const Footer = dynamic(() => import("../components/Global/Footer"), {
  suspense: true,
});
const MailingList = dynamic(() => import("../components/Global/MailingList"), {
  suspense: true,
});

declare global {
  interface Window {
    Tawk_API: any;
    dataLayer: any;
  }
}

const customTheme: ThemeConfig = extendTheme(defaultTheme, themeConfig);

export const sanityFetcher = (query: string) => sanity.fetch(query);

const settingsQuery = `*[ _type == "settings" ][0]
{ 
  ...,
  menu { 
    mega_menu[]{
      ...,
      _type == 'collectionGroup' => @{ 
        collectionLinks[]-> 
      },
      _type != 'collectionGroup' => @
    },
    links[]{
      _type == 'reference' => @->,
      _type != 'reference' => @,
    }
  } 
}`;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [cart, setCart] = useState<any>({ id: null, lines: [] });
  const [user, setUser, token, setToken] = useUser();
  const { data: settings, error } = useSWR(settingsQuery, sanityFetcher);
  const shop = { name: "TOR Salon Products" };

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
              {router.pathname !== "/wholesale" && settings && (
                <Banner data={settings.banner} />
              )}
              {/* <NavBar /> */}
              {settings && <Navigation menu={settings.menu} />}
              <Component key={router.asPath} {...pageProps} />
            </CartContext.Provider>
            <Follow />
            <Suspense fallback={"..."}>
              <Footer />
            </Suspense>
          </ShopContext.Provider>
        </AuthContext.Provider>
        <ColorModeScript initialColorMode={customTheme.initialColorMode} />
        {process.env.NODE_ENV === "production" && (
          <Script
            id="tawk_tag"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/622337bb1ffac05b1d7d1403/1ftcp3dfu';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();`,
            }}
          />
        )}
        {process.env.NODE_ENV === "production" && settings && (
          <Suspense fallback={`...`}>
            <MailingList settings={settings.emailPopup} />
          </Suspense>
        )}
      </ChakraProvider>
      {process.env.NODE_ENV === "production" && (
        <Script
          id="tagManager"
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
