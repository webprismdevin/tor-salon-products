import Script from "next/script";

export default function AnalyticsScripts() {
  if(process.env.NODE_ENV === "production") return (
    <>
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
