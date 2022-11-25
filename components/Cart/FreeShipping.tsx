import { Box, Stack, Text, Progress } from "@chakra-ui/react";

export default function FreeShippingProgress({ cart }: { cart?: any }) {
  if(cart && cart.lines && cart.lines.length === 0) return null

  return (
    <Box pb={4} w="full">
      <Stack direction="row" w="full" justify={"space-between"}>
        <Box>
          <Box>
            {cart.estimatedCost.totalAmount.amount < 100 ? (
              <Text textAlign={"center"}>
                Add ${100 - Math.ceil(cart.estimatedCost.totalAmount.amount)} for free
                shipping!
              </Text>
            ) : (
              <Text>Free shipping unlocked!</Text>
            )}
          </Box>
        </Box>
        <Text textAlign={"right"}>$100</Text>
      </Stack>
      <Progress
        mt={2}
        size="lg"
        value={cart.estimatedCost.totalAmount.amount}
        colorScheme={
          cart.estimatedCost.totalAmount.amount < 100 ? "orange" : "green"
        }
      />
    </Box>
  );
}
