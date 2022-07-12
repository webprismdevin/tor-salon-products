import {
  Box, Text,
  Button, Image,
  useNumberInput,
  HStack,
  Input,
  AspectRatio,
  CloseButton,
  Stack
} from "@chakra-ui/react";
import React, { useContext } from "react";
import updateCartItemQty from "../../lib/Cart/updateCartItemQty";
import CartContext from "../../lib/CartContext";
import formatter from "../../lib/formatter";

export function CartLineItem({
  product, removeItem,
}: {
  product: any;
  removeItem: any;
}) {
  return (
    <Stack direction="row" w="full" justify={"space-between"} pb={[4, 2]}>
      <AspectRatio
        ratio={1 / 1}
        flexGrow={0}
        minW={["100px", "120px"]}
        maxW={["100px", "120px"]}
      >
        <Image
          borderRadius={6}
          src={product.node.merchandise.image?.url}
          alt={product.node.merchandise.product.title} />
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
            onClick={() => removeItem(product.node.id)} />
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
function ItemQty({ product }: { product: any; }) {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step: 1,
    min: 0,
    defaultValue: product.node.quantity,
  });
  const { cart, setCart } = useContext(CartContext);

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps({ readOnly: false });

  async function handleQtyUpdate(newQty: string) {
    const resp = await updateCartItemQty(cart.id, product.node.id, parseInt(newQty));

    console.log(resp.cartLinesUpdate)

    setCart({
      ...cart,
      status: "clean",
      estimatedCost: resp.cartLinesUpdate.cart.estimatedCost,
      lines: resp.cartLinesUpdate.cart.lines.edges,
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
        onBlur={(e) => handleQtyUpdate(e.target.value)} />
      <Button size="sm" fontSize="md" {...inc} variant="ghost">
        +
      </Button>
    </HStack>
  );
}
