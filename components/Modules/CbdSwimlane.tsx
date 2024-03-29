"use client";
import Card from "../../components/Card";
import { imageBuilder } from "../../lib/sanity";
import { CbdCheckout } from "../../app/cbd/product/[handle]/CbdCheckout";
import { formatUSD } from "lib/utils";

export type CollectionResponse = {
  collection: {
    products: {
      edges: any[];
    };
  };
};

export default function CbdSwimlane({ data }: any) {
  const { collection, title } = data;
  const { products } = collection;

  return (
    <div
      className="flex flex-col gap-2 w-full py-4 md:py-8 text-center md:text-left no-scrollbar"
      style={{
        background: data.colorTheme?.background?.hex ?? "#ffffff",
        color: data.colorTheme?.text?.hex ?? "#121212",
      }}
    >
      <div className="px-9">
        <h2
          className="font-heading text-2xl md:text-3xl lg:text-4xl pb-4"
          style={{
            color: data.colorTheme?.text?.hex ?? "#121212",
          }}
        >
          {title}
        </h2>
        {/* <p>{data.subtitle}</p> */}
      </div>
      <div className="flex snap-x overflow-auto gap-4 md:gap-12">
        {products.map((product: any) => {
          return (
            <div
              className="snap-center first:ml-8 last:pr-8"
              key={product._id}
            >
              <Card
                content={{
                  title: product.title,
                  path: `/cbd/product/${product.slug.current}`,
                  imageUrl: imageBuilder(product.images[0]).url(),
                }}
              >
                <CbdCheckout
                  checkoutUrl={product.checkoutUrl}
                  handle={product.slug.current}
                >
                  <div className="whitespace-nowrap font-heading text-lg md:text-xl">
                    {formatUSD(product.priceRange.price)} | Buy&nbsp;
                    <span className="hidden md:inline">Now</span>
                  </div>
                </CbdCheckout>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
