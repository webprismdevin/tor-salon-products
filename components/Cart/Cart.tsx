"use client";

import {
  Flex,
  Box,
  VStack,
  Text,
  Button,
  Divider,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useContext, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CartContext } from "../../app/cart-provider";
import formatter from "../../lib/formatter";
import FreeShippingProgress from "./FreeShipping";
import { CartLineItem } from "../Cart/CartLineItem";
import loadCart from "../../lib/Cart/loadCart";
import createCart from "../../lib/Cart/createCart";
import removeCartItem from "../../lib/Cart/removeCartItem";
import CartRecommendations from "./CartRecommendations";
import ShopPayInstallments from "./ShopPayInstallments";
import DiscountCodeInput from "./DiscountCodeInput";
import {
  SiApplepay,
  SiGooglepay,
  SiMastercard,
  SiPaypal,
  SiVisa,
} from "react-icons/si";
import { usePlausible } from "next-plausible";

declare interface LineItemType {
  node: {
    id: string;
    image: { url: string };
    name: string;
    currentQuantity: number;
    discountedTotalSet: { shopMoney: { amount: string } };
  };
}

export type CartResponse = {
  cart: {
    checkoutUrl: string;
    id: string;
    status: "clean" | "dirty";
    estimatedCost: {
      totalAmount: {
        amount: number;
      };
      subtotalAmount: {
        amount: number;
      };
    };
    lines: {
      edges: LineItemType[];
    };
    discountCodes: [any];
  };
};

export type RemoveItemCartResponse = {
  cartLinesRemove: CartResponse;
};

const Cart = ({ color }: { color?: string }) => {
  const { cart, setCart } = useContext(CartContext);
  const [cartQty, setCartQty] = useState<number | null>(null);
  const plausible = usePlausible();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (cart.lines.length > 1) {
      const cartQtyCalc = cart.lines.reduce(
        (partialSum: any, current: any) => partialSum + current.node?.quantity,
        0
      );
      setCartQty(cartQtyCalc);
    }

    if (cart.lines.length === 1) {
      // @ts-ignore
      setCartQty(cart.lines[0].node.quantity);
    }
  }, [cart]);

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (cart.status === "dirty") getCart();
  }, [cart]);

  async function getCart() {
    let localCartData = await JSON.parse(
      window.localStorage.getItem(
        `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart`
      ) as any
    );

    if (localCartData) {
      const existingCart = (await loadCart(localCartData.id)) as CartResponse;

      if (existingCart.cart !== null) {
        if (
          existingCart.cart.lines.edges.length > 0 &&
          cart.status === "dirty"
        ) {
          onOpen();
        }

        setCart({
          id: localCartData.id,
          checkoutUrl: localCartData.checkoutUrl,
          status: "clean",
          estimatedCost: existingCart.cart.estimatedCost,
          lines: existingCart.cart.lines.edges,
          discountCodes: existingCart.cart.discountCodes,
        });

        return;
      }
    }

    localCartData = await createCart();

    setCart({
      id: localCartData.cartCreate.cart.id,
      checkoutUrl: localCartData.cartCreate.cart.checkoutUrl,
      estimatedCost: null,
      lines: [],
    });

    window.localStorage.setItem(
      `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart`,
      JSON.stringify(localCartData.cartCreate.cart)
    );
  }

  async function removeItem(lineItemId: string) {
    const resp = (await removeCartItem(
      cart.id,
      lineItemId
    )) as RemoveItemCartResponse;

    setCart({
      ...cart,
      status: "clean",
      estimatedCost: resp.cartLinesRemove.cart.estimatedCost,
      lines: resp.cartLinesRemove.cart.lines.edges,
    });
  }

  async function handleCheckout() {
    if (process.env.NODE_ENV === "production") {
      plausible("Checkout");

      window.location.href = cart.checkoutUrl;
    }
    if (process.env.NODE_ENV === "development") {
      window.location.href = cart.checkoutUrl;
    }
  }

  return (
    <>
      <div
        onClick={onOpen}
        className="cursor-pointer inline-flex items-start flex-start transition-opacity transition-duration-200 hover:opacity-40"
      >
        <div className="inline">Cart</div>
        <div className="inline -mt-[8px] text-sm">
          {cart.lines.length > 0 && cartQty}
        </div>
      </div>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Stack spacing={2}>
              <Text
                fontSize={"2xl"}
                textTransform={"uppercase"}
                fontWeight="bold"
              >
                Your Cart
              </Text>
              <Divider />
              <>
                <Text fontSize={"md"}>
                  Free U.S. shipping on orders of $100+
                </Text>
                <FreeShippingProgress cart={cart} />
                <Divider />
              </>
            </Stack>
          </DrawerHeader>
          <DrawerBody pl={[4]} pr={[4, 6]}>
            <VStack
              justifyContent={cart.lines.length === 0 ? "center" : "flex-start"}
              alignItems={cart.lines.length === 0 ? "center" : "flex-start"}
              h="full"
              w="full"
            >
              {cart.lines.length === 0 && <EmptyCart />}
              {cart.lines.length > 0 && (
                <>
                  {cart.lines.map((l: any) => (
                    <React.Fragment key={l.node.id}>
                      <CartLineItem product={l} removeItem={removeItem} />
                      <Divider />
                    </React.Fragment>
                  ))}
                  <CartRecommendations />
                </>
              )}
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <VStack w="full" spacing={2}>
              <DiscountCodeInput />
              <Divider />
              <ShopPayInstallments />
              {cart && cart.lines && cart.lines.length > 0 && (
                <Flex
                  w="100%"
                  justifyContent={"space-between"}
                  fontSize="md"
                  fontWeight={400}
                >
                  <Text>Taxes &amp; Shipping:</Text>
                  <Text>Calculated at checkout</Text>
                </Flex>
              )}
              <TotalCost cart={cart} />
              <Button
                fontSize={"2xl"}
                size="lg"
                borderRadius={0}
                onClick={handleCheckout}
                w="full"
              >
                Checkout
              </Button>
              <HStack w="full" justify={"space-around"}>
                <Icon as={SiApplepay} boxSize={[6, 8]} />
                <Icon as={SiGooglepay} boxSize={[8, 10]} />
                <Icon as={SiMastercard} boxSize={[6, 8]} />
                <Icon as={SiVisa} boxSize={[8, 10]} />
                <Icon as={SiPaypal} boxSize={[4, 5]} />
              </HStack>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

function EmptyCart() {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      direction="column"
      maxW="full"
    >
      <Icon as={AiOutlineShoppingCart} color="gray.400" boxSize={8} />
      <Text textAlign="center" mt={4} fontSize={16}>
        Hmmm...it&apos;s pretty empty in here!
      </Text>
    </Flex>
  );
}

export default Cart;

function TotalCost({ cart }: { cart: any }) {
  if (!cart.estimatedCost) return <></>;

  return (
    <Flex
      w="100%"
      justifyContent={"space-between"}
      fontSize="lg"
      fontWeight={600}
    >
      <Text>Estimated Total:</Text>
      <Text>{formatter.format(cart.estimatedCost.totalAmount.amount)}</Text>
    </Flex>
  );
}
