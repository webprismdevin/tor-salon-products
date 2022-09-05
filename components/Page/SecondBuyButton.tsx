import {
  Box,
  Container, Stack
} from "@chakra-ui/react";
import React from "react";
import {
  AddToCart, Pricebox,
  VariantSwatches
} from "./Hero";


export default function SecondBuyButton({ product }: any) {
  return (
    <Box>
      <Container centerContent py={20}>
        <Stack spacing={3} align="center">
          <Pricebox variants={product.variants} />
          <VariantSwatches variants={product.variants} />
          <AddToCart />
        </Stack>
      </Container>
    </Box>
  );
}
