import Script from "next/script";

export default function AnalyticsScripts() {
  // if (process.env.NODE_ENV === "production")
  return (
    <>
      {/* Shopify Collabs */}
      <Script src="https://dttrk.com/shopify/track.js?shop=tor-salon-products.myshopify.com" />
      <Script id="fbPixelInit">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '711750850270833');`}
      </Script>
    </>
  );

  // return null;
}
