//this is not the typical ATC function
import { useContext } from "react"
import addToCart from "./Cart/addToCart";
import CartContext from "./CartContext"
import { usePlausible } from "next-plausible"
import { createHash } from "crypto";
import AuthContext from "./auth-context";

function hash(data: string) {
  return createHash("sha256").update(data).digest("hex")
}

export default function useAddToCart(){
    const { cart, setCart } = useContext(CartContext)
    const { user } = useContext(AuthContext);
    const plausible = usePlausible()

    const singleAddToCart = async (variantId:string) => {
        const response = await addToCart(cart.id, variantId, 1, "");

        window.comet('add_to_cart');
        plausible("Add_To_Cart")

        setCart({
          ...cart,
          status: "dirty",
          lines: response.cartLinesAdd.cart.lines,
        });
    }

    const addItemToCart = async (variantId:string, qty: number, subscriptionPlan: string) => {
      console.log("fired addItemToCart")
      const response = await addToCart(cart.id, variantId, qty, subscriptionPlan);

      window.comet('add_to_cart');
      plausible("Add To Cart")

      setCart({
        ...cart,
        status: "dirty",
        lines: response.cartLinesAdd.cart.lines,
      });

      console.log(response.cartLinesAdd.cart.lines)

      if (window.dataLayer) {
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: "add_to_cart",
          currency: "USD",
          value: response.cartLinesAdd.cart.lines.edges[0].node.merchandise.priceV2.amount,
          user_data: {
            email: user ? hash(user.email) : null,
          },
          items: [
            {
              item_id: response.cartLinesAdd.cart.lines.edges[0].node.merchandise.product.id,
              item_name: response.cartLinesAdd.cart.lines.edges[0].node.merchandise.product.title,
              item_category: response.cartLinesAdd.cart.lines.edges[0].node.merchandise.product.productType,
              price: response.cartLinesAdd.cart.lines.edges[0].node.merchandise.priceV2.amount,
              quantity: 1,
              item_variant: response.cartLinesAdd.cart.lines.edges[0].node.merchandise.title,
            }
          ],
        });
      }
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

    return { singleAddToCart, addItemToCart, instantCheckout }
}