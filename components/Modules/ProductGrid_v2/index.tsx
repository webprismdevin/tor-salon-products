import { Heading } from "components/Heading";
import { createElement } from "react";
import ProductCard from "./ProductCard";

export type ProductGridProps = {
  data: any;
};

export default function ProductGrid({ data }: ProductGridProps) {
  return (
    <div className="grid col-span-2 md:grid-cols-3 gap-4 md:gap-12 place-items-center mx-auto p-4 md:p-12">
      <div className="col-span-2 md:col-span-3 w-full text-left grid gap-4">
        <p>{data.caption}</p>
        <Heading as="h2">{data.title}</Heading>
      </div>
      {data.products.map((product: any) => {
        return (
          <ProductCard
            key={product.gid}
            product={{
              gid: product.gid,
              title: product.title,
              featuredImage: product.featuredImage,
              price: product.priceRange.minVariantPrice,
              handle: product.handle,
            }}
          />
        );
      })}
    </div>
  );
}
