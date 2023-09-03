import React from "react";
import Image from "next/image";
import Link from "next/link";
import { removeCents } from "../../../lib/utils";
import AddToCartButton from "./AddToCartButton";

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
          alt={product.title}
          width={320}
          height={320}
          className="mx-auto aspect-square"
        />
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
  );
}

export function Price({ price }: { price: number }) {
  return <span>${removeCents(price)}</span>;
}
