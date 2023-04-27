import type { AppProps } from "next/app";
import {
  extendTheme,
  ChakraProvider,
  ColorModeScript,
  useToast,
} from "@chakra-ui/react";
//context
import CartContext from "../lib/CartContext";
import AuthContext from "../lib/auth-context";
//next & react deps
import Head from "next/head";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
//libs
import { sanity } from "../lib/sanity";
import useSWR from "swr";
import applyDiscountToCart from "../lib/Cart/applyDiscountToCart";
import useUser from "../lib/useUser";
//analytics
import { Analytics } from "@vercel/analytics/react";
import PlausibleProvider from "next-plausible";
//styles & theme
import { theme as defaultTheme, ThemeConfig } from "@chakra-ui/theme";
import themeConfig from "../lib/theme";
import "../styles/globals.css";
import AnalyticsScripts from "components/AnalyticsScripts";

import {
  sendShopifyAnalytics,
  getClientBrowserParameters,
  AnalyticsEventName,
  useShopifyCookies,
  type ShopifyPageViewPayload,
  ShopifyProvider,
} from "@shopify/hydrogen-react";

const Banner = dynamic(() => import("../components/Global/Banner"));
const Navigation = dynamic(() => import("../components/Global/Navigation"));
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
    comet: any;
    fbq: any;
  }
}

// shopify analytics
function sendPageView(analyticsPageData: ShopifyPageViewPayload) {
  const payload: ShopifyPageViewPayload = {
    ...getClientBrowserParameters(),
    ...analyticsPageData,
  };

  sendShopifyAnalytics(
    {
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload,
    },
    "checkout.torsalonproducts.com"
  );
}

const analyticsShopData = {
  shopId: "gid://shopify/Shop/62876287222",
  currency: "USD",
  acceptedLanguage: "en",
};

let isInit = false;
// shopify analytics

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
  const toast = useToast();

  const hasUserConsent = true;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const analytics: ShopifyPageViewPayload = {
    hasUserConsent,
    ...analyticsShopData,
    ...pageProps.analytics,
  };
  const pagePropsWithAppAnalytics = {
    ...pageProps,
    analytics,
  };

  useEffect(() => {
    const handleRouteChange = () => {
      sendPageView(analytics);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    // First load event guard
    if (!isInit) {
      isInit = true;
      sendPageView(analytics);
    }

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [analytics, router.events]);
  useShopifyCookies({ hasUserConsent });

  useEffect(() => {
    if (typeof window) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.customStyle = {
        zIndex: 199,
      };
    }
  }, []);

  useEffect(() => {
    const queryString = router.asPath.split("?")[1];
    const queryObj = new URLSearchParams(queryString);

    if (queryObj.get("discount") && cart && cart.id) {
      console.log(cart.id);
      applyDiscountToCart(cart.id, queryObj.get("discount")!).then((res) => {
        if (res.cartDiscountCodesUpdate.cart.discountCodes.length > 0) {
          toast({
            title: "Discount Applied",
            description: `Your discount has been applied!`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      });
    }
  }, [cart.id]);

  return (
    <>
      <ShopifyProvider
        storeDomain="checkout.torsalonproducts.com"
        storefrontToken="a37e8b74cb52b6e0609c948c43bb0a5c"
        storefrontApiVersion="2023-04"
        countryIsoCode="US"
        languageIsoCode="EN"
      >
        <PlausibleProvider domain="torsalonproducts.com">
          <ChakraProvider theme={customTheme}>
            <AuthContext.Provider value={{ user, setUser, token, setToken }}>
              <Head>
                <meta name="theme-color" content="#ffffff" />
                <link rel="shortcut icon" href="/favicon.png" />
                <meta
                  name="facebook-domain-verification"
                  content="bk02y72cdwvcwzina508gmb7xv87g6"
                />
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: `{
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "TOR Salon Products",
                        "url": "https://torsalonproducts.com",
                        "logo": "https://torsalonproducts.com/tor_square_logo.png",
                        "sameAs": ["https://www.facebook.com/torproducts", "https://www.instagram.com/tor_salonproducts/"]
                      }`,
                  }}
                />
              </Head>
              <CartContext.Provider value={{ cart, setCart }}>
                {router.pathname !== "/wholesale" && settings && (
                  <Banner data={settings.banner} />
                )}
                <Navigation menu={settings?.menu} />
                <Component key={router.asPath} {...pagePropsWithAppAnalytics} />
              </CartContext.Provider>
              <Follow />
              <Suspense fallback={"..."}>
                <Footer />
              </Suspense>
            </AuthContext.Provider>
            <ColorModeScript initialColorMode={customTheme.initialColorMode} />
            <TawkTo />
            {settings && (
              <Suspense fallback={`...`}>
                <MailingList settings={settings.emailPopup} />
              </Suspense>
            )}
          </ChakraProvider>
        </PlausibleProvider>
        <AnalyticsScripts />
        <Analytics />
      </ShopifyProvider>
    </>
  );
}

export default MyApp;

function TawkTo({}) {
  return (
    <>
      {process.env.NODE_ENV === "production" && (
        <Script
          id="tawk_tag"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/622337bb1ffac05b1d7d1403/1ftcp3dfu';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();`,
          }}
        />
      )}
    </>
  );
}
