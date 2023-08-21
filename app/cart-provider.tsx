"use client";

import { createContext, useState } from "react";

export const CartContext = createContext({
  cart: {
    id: "",
    checkoutUrl: "",
    lines: [],
  },
  setCart: (cart: any) => {},
});

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<any>({ id: null, lines: [] });

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}
