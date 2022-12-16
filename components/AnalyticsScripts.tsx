import Script from "next/script";

export default function AnalyticsScripts() {
  if(process.env.NODE_ENV === "development") return (
    <>
      {/* Facebook */}
      {/* <Script
        id="facebookPixel"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '711750850270833');fbq('track', 'PageView');`,
        }}
      /> */}
      {/* <noscript> */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        {/* <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=711750850270833&ev=PageView&noscript=1"
        />
      </noscript> */}
      {/* Cometly */}
      <Script
        src="https://t.cometlytrack.com/e?uid=cb9398-7126-b99785-s"
        onLoad={() => {
          // @ts-ignore
          window.comet("init");
        }}
      />
      {/* Google Tag Manager */}
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
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://gtm.torsalonproducts.com/ns.html?id=GTM-MKG7C6H"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
      {/* Shopify Collabs */}
      <Script src="https://dttrk.com/shopify/track.js?shop=tor-salon-products.myshopify.com" />
    </>
  );

  return null;
}
