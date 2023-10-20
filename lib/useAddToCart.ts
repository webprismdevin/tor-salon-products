//this is not the typical ATC function
"use client";
import { useContext } from "react";
import addToCart, { AddToCartResponse } from "./Cart/addToCart";
import { CartContext } from "../app/cart-provider";
import { usePlausible } from "next-plausible";

export default function useAddToCart() {
  const { cart, setCart } = useContext(CartContext);
  const plausible = usePlausible();

  const singleAddToCart = async (variantId: string) => {
    const response = (await addToCart(cart.id, variantId, 1, "")) as any;

    plausible("Add_To_Cart");

    setCart({
      ...cart,
      status: "dirty",
      lines: response.cartLinesAdd.cart.lines,
    });
  };

  const addItemToCart = async (
    variantId: string,
    qty: number,
    subscriptionPlan: string
  ) => {
    const response = (await addToCart(
      cart.id,
      variantId,
      qty,
      subscriptionPlan
    )) as any;

    if (process.env.NODE_ENV === "production") {
      plausible("Add To Cart");
    }

    setCart({
      ...cart,
      status: "dirty",
      lines: response.cartLinesAdd.cart.lines,
    });
  };

  const instantCheckout = async (variantId: string) => {
    const response = await addToCart(cart.id, variantId, 1, "");

    if (process.env.NODE_ENV === "production") {
      plausible("Checkout");
    }
    if (process.env.NODE_ENV === "development") {
      window.location.href = cart.checkoutUrl;
    }
  };

  return { singleAddToCart, addItemToCart, instantCheckout };
}
