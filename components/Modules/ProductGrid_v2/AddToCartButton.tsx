"use client";

import { Button } from "components/Button";
import useAddToCart from "lib/useAddToCart";

export default function AddToCartButton({
  variantId,
  children,
}: {
  variantId: string;
  children?: any;
}) {
  const { addItemToCart } = useAddToCart();

  return (
    <Button
      width="full"
      variant="secondary"
      onClick={() => addItemToCart(variantId, 1, "")}
    >
      {children}
    </Button>
  );
}
