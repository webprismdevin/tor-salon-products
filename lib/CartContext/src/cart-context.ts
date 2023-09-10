import { createContext } from "react";

const CartContext = createContext<any>({
  cart: {
    cartId: "",
    checkoutUrl: "",
    lines: [],
  },
  updateCart: () => null,
});

export default CartContext