import Script from "next/script";

export default function Page() {
  return (
    <>
      <div>New PDP</div>
      <div
        className="w-full"
        key={"7668184285430"}
        id="looxReviews"
        data-product-id={"7668184285430"}
      ></div>
      <Script src="https://loox.io/widget/loox.js?shop=tor-salon-products.myshopify.com" />
    </>
  );
}
