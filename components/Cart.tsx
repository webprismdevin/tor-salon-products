import {
  Flex,
  Box,
  VStack,
  Text,
  Button,
  Link,
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
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useContext, useState } from "react";
import {
  AiOutlineShopping,
  AiOutlineDelete,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import CartContext from "../lib/CartContext";
import formatter from "../lib/formatter";

const Cart = () => {
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
      eventTimeout: 2000,
    });
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
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            Cart
            {cart.lines.length > 0 && (
              <IconButton
                ml={4}
                icon={<AiOutlineDelete />}
                size="sm"
                onClick={emptyCart}
                aria-label="empty cart"
                variant={"outline"}
              />
            )}
          </DrawerHeader>
          <DrawerBody p={8}>
            <VStack
              pt={8}
              justifyContent={cart.lines.length === 0 ? "center" : "flex-start"}
              alignItems={cart.lines.length === 0 ? "center" : "flex-start"}
              h="full"
            >
              {cart.lines.length === 0 && <EmptyCart />}
              {cart.lines.length > 0 && (
                <>
                  {cart.lines.map((l: any) => (
                    <CartLineItem
                      key={l.node.id}
                      product={l}
                      removeItem={removeItem}
                    />
                  ))}
                </>
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            {cart.lines.length > 0 && (
              <VStack w="full" spacing={2}>
                <Divider />
                {cart.estimatedCost && (
                  <Flex w="100%" justifyContent={"space-between"}>
                    <Text>Estimated Cost:</Text>
                    <Text>
                      {formatter.format(cart.estimatedCost.totalAmount.amount)}
                    </Text>
                  </Flex>
                )}
                <Button onClick={handleCheckout} w="full">
                  Checkout
                </Button>
              </VStack>
            )}
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
    <Flex
      borderBottom={"1px solid"}
      borderColor={"gray.300"}
      py={4}
      minW="100%"
      justifyContent="flex-start"
      alignItems={"flex-start"}
      gap={4}
    >
      <AspectRatio ratio={1 / 1} boxSize={"120px"} flexShrink={0}>
        <Image
          borderRadius={6}
          src={product.node.merchandise.product.images.edges[0].node.url}
          alt={product.node.merchandise.product.title}
        />
      </AspectRatio>
      <VStack flexGrow={1} spacing={2} alignItems={"flex-start"} mr={2}>
        <Text fontSize={20} fontWeight="bold">
          {product.node.merchandise.product.title}
        </Text>
        {product.node.merchandise.title !== "Default Title" && (
          <Text mt={1} fontSize={12}>
            {product.node.merchandise.title}
          </Text>
        )}
        <ItemQty product={product} />
      </VStack>
      <VStack spacing={1}>
        <Text>
          {formatter.format(product.node.estimatedCost.subtotalAmount.amount)}
        </Text>
        <Text
          fontSize="xs"
          cursor={"pointer"}
          onClick={() => removeItem(product.node.id)}
        >
          Remove
        </Text>
      </VStack>
    </Flex>
  );
}

function ItemQty({ product }: { product: any }) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      min: 1,
      defaultValue: product.node.quantity,
    });
  const { cart, setCart } = useContext(CartContext);

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps({ readOnly: true });

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
      <Button size="sm" {...dec}>
        -
      </Button>
      <Input
        size="sm"
        w={20}
        {...input}
        onBlur={(e) => handleQtyUpdate(e.target.value)}
      />
      <Button size="sm" {...inc}>
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
      maxW="200px"
    >
      <Icon as={AiOutlineShoppingCart} color="gray.400" />
      <Text textAlign="center" mt={4} fontSize={12}>
        Hmmm...it&apos;s pretty empty in here!
      </Text>
    </Flex>
  );
}

export default Cart;
