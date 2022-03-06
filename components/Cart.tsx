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
} from "@chakra-ui/react";
import { useEffect, useContext } from "react";
import {
  AiOutlineShopping,
  AiOutlineDelete,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import CartContext from "../lib/CartContext";
import formatter from "../lib/formatter";

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cartQty = cart.lines.length;

  async function getCart() {
    let localCartData = await JSON.parse(window.localStorage.getItem(
      `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart`
      ) as any
    );

    if (localCartData) {
      const existingCart = await fetch(
        `/api/load-cart?cartId=${localCartData.id}`
      ).then((res) => res.json());

      console.log(existingCart);

      if (existingCart.cart !== null) {
        if (
          existingCart.cart.lines.edges.length > 0 &&
          cart.status === "dirty"
        ) {
          console.log("should open");
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

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (cart.status === "dirty") getCart();
  }, [cart]);

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
    const resp = await fetch("/api/remove-cart-item", 
    {
      method: "POST",
      body: JSON.stringify({
        cartId: cart.id,
        lineItemId: id
      })
    }).then(res => res.json())
    
    setCart({
      id: resp.cart.id,
      checkoutUrl: resp.cart.checkoutUrl,
      status: "clean",
      estimatedCost: resp.cart.estimatedCost,
      lines: resp.cart.lines.edges,
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
          mt="-8px"
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
              <Icon
                ml={2}
                height="12px"
                as={AiOutlineDelete}
                onClick={emptyCart}
                cursor="pointer"
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
                    <CartLineItem key={l.node.id} product={l} removeItem={removeItem} />
                  ))}
                </>
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter>
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
              <Link w="full" href={cart.checkoutUrl}>
                <Button w="full">Checkout</Button>
              </Link>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

function CartLineItem({ product, removeItem }: { product: any, removeItem: any}) {


  return (
    <Flex w="full" justifyContent="space-between" alignItems={"flex-start"} borderBottom={'1px solid'} borderColor={'gray.300'} pb={4}>
      <Image
        boxSize={"88px"}
        borderRadius={6}
        src={product.node.merchandise.product.images.edges[0].node.url}
        alt={product.node.merchandise.product.title}
      />
      <Box mr={2}>
        <Text fontSize={24} fontWeight="bold">
          {product.node.merchandise.product.title}
        </Text>
        <Text mt={1} fontSize={12}>
          Details: {product.node.merchandise.title}
        </Text>
        <Text fontSize={12} fontWeight="bold">
          Qty: {product.node.quantity}
        </Text>
      </Box>
      <Box textAlign={"right"}>
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
      </Box>
    </Flex>
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
        Might be time to add some stuff to your cart &#9825;
      </Text>
    </Flex>
  );
}

export default Cart;
