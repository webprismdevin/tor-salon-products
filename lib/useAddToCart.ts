import { useContext } from "react"
import addToCart from "./Cart/addToCart";
import CartContext from "./CartContext"
import { usePlausible } from "next-plausible"

export default function useAddToCart(){
    const { cart, setCart } = useContext(CartContext)
    const plausible = usePlausible()

    const singleAddToCart = async (variantId:string) => {
        const response = await addToCart(cart.id, variantId, 1, "");

        window.comet('add_to_cart');
        plausible("Add to Cart")

        setCart({
          ...cart,
          status: "dirty",
          lines: response.cartLinesAdd.cart.lines,
        });
    }

    const instantCheckout = async (variantId: string) => {
      const response = await addToCart(cart.id, variantId, 1, "");

      if (process.env.NODE_ENV === "production") {
        plausible("Checkout")

        window.dataLayer.push({
          event: "begin_checkout",
          eventCallback: () => (window.location.href = cart.checkoutUrl),
          eventTimeout: 2400,
        });
      }
      if (process.env.NODE_ENV === "development") {
        window.location.href = cart.checkoutUrl;
      }
    }

    return [ singleAddToCart, instantCheckout ]
}