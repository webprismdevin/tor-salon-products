"use client";

import React, { createContext, useState } from "react";

export const CartContext = createContext({
  cart: {
    id: "",
    checkoutUrl: "",
    lines: [],
    status: "clean",
    estimatedCost: {
      totalAmount: {
        amount: 0,
      },
      subtotalAmount: {
        amount: 0,
      },
    }
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
