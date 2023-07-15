//this is not the typical ATC function
import { useContext } from "react";
import addToCart, { AddToCartResponse } from "./Cart/addToCart";
import CartContext from "./CartContext";
import { usePlausible } from "next-plausible";
import AuthContext from "./auth-context";

export default function useAddToCart() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
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
    const response = await addToCart(cart.id, variantId, qty, subscriptionPlan) as any;

    if (process.env.NODE_ENV === "production") {
      plausible("Add To Cart");
    }

    setCart({
      ...cart,
      status: "dirty",
      lines: response.cartLinesAdd.cart.lines,
    });

    console.log(response.cartLinesAdd.cart.lines);
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
