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
  useToast,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useContext, useState } from "react";
import { AiOutlineShopping, AiOutlineShoppingCart } from "react-icons/ai";
import CartContext from "../../lib/CartContext";
import formatter from "../../lib/formatter";
import FreeShippingProgress from "./FreeShipping";
import { CartLineItem } from "../Cart/CartLineItem";
import loadCart from "../../lib/Cart/loadCart";
import createCart from "../../lib/Cart/createCart";
import removeCartItem from "../../lib/Cart/removeCartItem";
import CartRecommendations from "./CartRecommendations";
import ShopPayInstallments from "./ShopPayInstallments";
import DiscountCodeInput from "./DiscountCodeInput";
import { SiApplepay, SiGooglepay, SiMastercard, SiPaypal, SiVisa } from "react-icons/si";
import { usePlausible } from "next-plausible";
import AuthContext from "lib/auth-context";
import { createHash } from "crypto";

declare interface LineItemType {
  node: {
    id: string;
    image: { url: string };
    name: string;
    currentQuantity: number;
    discountedTotalSet: { shopMoney: { amount: string } };
  };
}

const Cart = ({ color }: { color?: string }) => {
  const { user } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const [cartQty, setCartQty] = useState<number | null>(null);
  const router = useRouter();
  const plausible = usePlausible();

  const { isOpen, onOpen, onClose } = useDisclosure();

  function hash(data: string) {
    return createHash("sha256").update(data).digest("hex")
  }  

  useEffect(() => {
    if (cart.lines.length > 1) {
      const cartQtyCalc = cart.lines.reduce(
        (partialSum: any, current: any) => partialSum + current.node?.quantity,
        0
      );
      setCartQty(cartQtyCalc);
    }

    if (cart.lines.length === 1) {
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
      const existingCart:any = await loadCart(localCartData.id);

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
          discount: existingCart.cart.discountCodes,
        });

        return;
      }
    }

    localCartData = await createCart();

    console.log(localCartData);

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
    const resp:any = await removeCartItem(cart.id, lineItemId);

    console.log(resp.cartLinesRemove);

    setCart({
      ...cart,
      status: "clean",
      estimatedCost: resp.cartLinesRemove.cart.estimatedCost,
      lines: resp.cartLinesRemove.cart.lines.edges,
    });
  }

  async function handleCheckout() {

    if (process.env.NODE_ENV === "production") {
      plausible("Checkout")

      window.location.href = cart.checkoutUrl;

    }
    if (process.env.NODE_ENV === "development") {
      window.location.href = cart.checkoutUrl;
    }
  }

  return (
    <>
      <Box
        onClick={onOpen}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "flex-start",
          transition: "opacity 200ms ease",
        }}
        _hover={{
          opacity: 0.4,
        }}
        transition={"opacity 200ms ease"}
      >
        <Icon
          as={AiOutlineShopping}
          style={{
            display: "inline",
          }}
          boxSize={6}
          color={color ? color : "black"}
        />
        <Text
          fontSize={12}
          mt={["-8px"]}
          style={{
            display: "inline",
          }}
        >
          {cart.lines.length > 0 && cartQty}
        </Text>
      </Box>
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
              {!router.asPath.includes("/offer") && (
                <>
                  <Text fontSize={"md"}>
                    Free U.S. shipping on orders of $100+
                  </Text>
                  <FreeShippingProgress cart={cart} />
                  <Divider />
                </>
              )}
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
