import React from "react";
import { removeCents } from "../../../lib/utils";
import AddToCartButton from "./AddToCartButton";
import Card from "../../Card";

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
    <Card
      content={{
        title: product.title,
        imageUrl: product.featuredImage,
        path: `/product/${product.handle}`,
      }}
    >
      <AddToCartButton variantId={product.variantId}>
        <Price price={product.price} />
        &nbsp;|&nbsp;
        <span>
          Add <span className="hidden md:inline">To Cart</span>
        </span>
      </AddToCartButton>
    </Card>
  );
}

export function Price({ price }: { price: number }) {
  return <span>${removeCents(price)}</span>;
}
