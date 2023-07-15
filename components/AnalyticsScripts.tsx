import Script from "next/script";

export default function AnalyticsScripts() {
  if (process.env.NODE_ENV === "production")
    return (
      <>
        {/* Shopify Collabs */}
        <Script src="https://dttrk.com/shopify/track.js?shop=tor-salon-products.myshopify.com" />
      </>
    );

  return null;
}
