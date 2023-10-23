import React from "react";
import { removeCents } from "../../../lib/utils";
import AddToCartButton from "./AddToCartButton";
import Card from "../../Card";
import extractGID from "../../../lib/extract-gid";
import Link from "next/link";
import Image from "next/image";

export type ProductCardProps = {
  product: {
    gid: string;
    title: string;
    featuredImage: string;
    price: number;
    handle: string;
    variantId: string;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="min-w-[140px] md:w-[260px] grid gap-3">
      <Link href={`/product/${product.handle}`}>
        <Image
          src={product.featuredImage}
          width={320}
          height={320}
          alt={product.title}
        />
      </Link>
      <div
        className="loox-rating mx-auto h-6"
        data-fetch
        data-id={extractGID(product.gid)}
      />
      <Link href={`/product/${product.handle}`}>
        <h3 className="text-center text-lg line-clamp-2 h-14">
          {product.title}
        </h3>
      </Link>
      <AddToCartButton variantId={product.variantId}>
        <Price price={product.price} />
        &nbsp;|&nbsp;
        <span>
          Add <span className="hidden md:inline">To Cart</span>
        </span>
      </AddToCartButton>
    </div>
    // <Card
    //   content={{
    //     title: null
    //     imageUrl: product.featuredImage,
    //     path: `/product/${product.handle}`,
    //   }}
    // >
    //   <div
    //     className="loox-rating mx-auto h-6"
    //     data-fetch
    //     data-id={extractGID(product.gid)}
    //   />
    //   <AddToCartButton variantId={product.variantId}>
    //     <Price price={product.price} />
    //     &nbsp;|&nbsp;
    //     <span>
    //       Add <span className="hidden md:inline">To Cart</span>
    //     </span>
    //   </AddToCartButton>
    // </Card>
  );
}

export function Price({ price }: { price: number }) {
  return <span>${removeCents(price)}</span>;
}
