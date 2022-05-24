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
  Image,
  useNumberInput,
  HStack,
  Input,
  AspectRatio,
  CloseButton,
  Stack,
  Tooltip,
  Progress,
} from "@chakra-ui/react";
import React, { useEffect, useContext, useState } from "react";
import {
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import CartContext from "../lib/CartContext";
import formatter from "../lib/formatter";

const Cart = ({ color }: { color?: string}) => {
  const { cart, setCart } = useContext(CartContext);
  const [cartQty, setCartQty] = useState<number | null>(null);

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
      const existingCart = await fetch(
        `/api/load-cart?cartId=${localCartData.id}`
      ).then((res) => res.json());

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
        });

        return;
      }
    }

    localCartData = await fetch("/api/create-cart").then((res) => res.json());

    setCart({
      id: localCartData.id,
      checkoutUrl: localCartData.checkoutUrl,
      estimatedCost: null,
      lines: [],
    });

    window.localStorage.setItem(
      `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart`,
      JSON.stringify(localCartData)
    );
  }

  async function emptyCart() {
    window.localStorage.removeItem(
      `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart`
    );

    const localCartData = await fetch("/api/create-cart").then((res) =>
      res.json()
    );

    setCart({
      id: localCartData.id,
      checkoutUrl: localCartData.checkoutUrl,
      estimatedCost: null,
      lines: [],
    });

    window.localStorage.setItem(
      `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart`,
      JSON.stringify(localCartData)
    );
  }

  async function removeItem(id: string) {
    const resp = await fetch("/api/remove-cart-item", {
      method: "POST",
      body: JSON.stringify({
        cartId: cart.id,
        lineItemId: id,
      }),
    }).then((res) => res.json());

    setCart({
      id: resp.cart.id,
      checkoutUrl: resp.cart.checkoutUrl,
      status: "clean",
      estimatedCost: resp.cart.estimatedCost,
      lines: resp.cart.lines.edges,
    });
  }

  async function handleCheckout() {
    window.dataLayer.push({
      event: "begin_checkout",
      eventCallback: () => (window.location.href = cart.checkoutUrl),
      eventTimeout: 1200,
    });
  }

  async function addToCart(id:string) {
    const response = await fetch("/api/addtocart", {
      method: "POST",
      body: JSON.stringify({
        variantId: id,
        cartId: cart.id,
        qty: 1,
      }),
    }).then((res) => res.json());

    setCart({
      ...cart,
      status: "dirty",
      lines: response.response.cartLinesAdd.cart.lines,
    });
  }

  const howManyLipBalms = Math.ceil(
    (100 - cart.estimatedCost?.totalAmount.amount) / 4
  );

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
          color={color ? color : 'black'}
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
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
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
              <Text fontSize={"md"}>Free U.S. shipping on orders of $100+</Text>
              <Divider />
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
                  <Box py={4} w="full">
                    {cart.estimatedCost.totalAmount.amount < 100 ? (
                      <Text textAlign={"center"}>
                        Add ${100 - cart.estimatedCost.totalAmount.amount} for
                        free shipping!
                      </Text>
                    ) : (
                      <Text>Free shipping unlocked!</Text>
                    )}
                    <Text textAlign={"right"} fontSize="xs">
                      $100
                    </Text>
                    <Progress
                      value={cart.estimatedCost.totalAmount.amount}
                      colorScheme={
                        cart.estimatedCost.totalAmount.amount < 100
                          ? "blackAlpha"
                          : "green"
                      }
                    />
                    {cart.estimatedCost.totalAmount.amount < 100 && (
                      <Stack spacing={2} mt={4} align={"center"}>
                        <Text>
                          That&apos;s only <strong>{howManyLipBalms}</strong>{" "}
                          lip balms! Add for only $4!
                        </Text>
                        <Stack direction="row">
                          <Button
                            onClick={() =>
                              addToCart(
                                "gid://shopify/ProductVariant/43229151625462"
                              )
                            }
                            size="sm"
                          >
                            Add Mint Lip Balm!
                          </Button>
                          <Button
                            onClick={() =>
                              addToCart(
                                "gid://shopify/ProductVariant/43229151592694"
                              )
                            }
                            size="sm"
                          >
                            Add Regular Lip Balm!
                          </Button>
                        </Stack>
                      </Stack>
                    )}
                  </Box>
                  <Divider />
                </>
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            {/* {cart.lines.length > 0 && ( */}
            <VStack w="full" spacing={2}>
              <Divider />
              {cart.estimatedCost && (
                <Flex
                  w="100%"
                  justifyContent={"space-between"}
                  fontSize="lg"
                  fontWeight={600}
                >
                  <Text>Total:</Text>
                  <Text>
                    {formatter.format(cart.estimatedCost.totalAmount.amount)}
                  </Text>
                </Flex>
              )}
              <HStack justify={"center"} w="full">
                <Text fontSize={"xs"}>
                  Pay in 4 installments. Interest-free.
                </Text>
                <Tooltip
                  label="Purchase now and pay later with Shop Pay Installments. Most approvals are instant, and pay no interest or fees with on-time payments."
                  aria-label="A tooltip"
                >
                  <span>
                    <Icon as={AiOutlineInfoCircle} />
                  </span>
                </Tooltip>
              </HStack>
              <Button
                fontSize={"2xl"}
                size="lg"
                onClick={handleCheckout}
                w="full"
              >
                Checkout
              </Button>
            </VStack>
            {/* )} */}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

function CartLineItem({
  product,
  removeItem,
}: {
  product: any;
  removeItem: any;
}) {
  return (
    <Stack
      direction="row"
      w="full"
      justify={"space-between"}
      pb={[4, 2]}
      // borderBottom={"2px solid"}
      // borderBottomColor={"gray.400"}
    >
      <AspectRatio
        ratio={1 / 1}
        flexGrow={0}
        minW={["100px", "140px"]}
        maxW={["100px", "140px"]}
      >
        <Image
          borderRadius={6}
          src={product.node.merchandise.product.images.edges[0].node.url}
          alt={product.node.merchandise.product.title}
        />
      </AspectRatio>
      <Stack spacing={6} flexGrow={1}>
        <Stack direction="row">
          <Box flexGrow={1}>
            <Text fontSize={[16, 18]} fontWeight="bold">
              {product.node.merchandise.product.title}
            </Text>
            {product.node.merchandise.title !== "Default Title" && (
              <Text mt={1} fontSize={[14, 16]}>
                {product.node.merchandise.title}
              </Text>
            )}
          </Box>
          <CloseButton
            cursor={"pointer"}
            userSelect="none"
            onClick={() => removeItem(product.node.id)}
          />
        </Stack>
        <Stack direction="row" justify={"space-between"}>
          <ItemQty product={product} />
          <Text fontSize={[16, 18]}>
            {formatter.format(product.node.estimatedCost.totalAmount.amount)}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}

function ItemQty({ product }: { product: any }) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      min: 0,
      defaultValue: product.node.quantity,
    });
  const { cart, setCart } = useContext(CartContext);

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps({ readOnly: false });

  async function handleQtyUpdate(newQty: string) {
    const resp = await fetch("/api/update-cart-item-qty", {
      method: "POST",
      body: JSON.stringify({
        cartId: cart.id,
        lines: {
          id: product.node.id,
          quantity: newQty,
        },
      }),
    }).then((res) => res.json());

    setCart({
      id: resp.cart.id,
      checkoutUrl: resp.cart.checkoutUrl,
      status: "clean",
      estimatedCost: resp.cart.estimatedCost,
      lines: resp.cart.lines.edges,
    });
  }

  return (
    <HStack>
      <Button size="sm" fontSize="md" {...dec} variant="ghost">
        -
      </Button>
      <Input
        size="sm"
        borderRadius={5}
        textAlign="center"
        w={[10]}
        {...input}
        onBlur={(e) => handleQtyUpdate(e.target.value)}
      />
      <Button size="sm" fontSize="md" {...inc} variant="ghost">
        +
      </Button>
    </HStack>
  );
}

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
