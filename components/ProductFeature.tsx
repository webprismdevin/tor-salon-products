import {
  Container,
  Heading,
  Text,
  Stack,
  AspectRatio,
  Image,
  Divider,
  Link,
  LinkBox,
  LinkOverlay,
  Button,
} from "@chakra-ui/react";
import NextLink from "next/link";
import formatter from "../lib/formatter";
import CartContext from "../lib/CartContext";
import addToCart from "../lib/Cart/addToCart";
import { useContext } from "react";

export default function ProductFeature({ reference }: any) {
  const { cart, setCart } = useContext(CartContext);

  async function handleAddToCart() {
    const response = await addToCart(cart.id, reference.variants.edges[0].node.id, 1, "")

    setCart({
      ...cart,
      status: "dirty",
      lines: response.cartLinesAdd.cart.lines,
    });

    if (window.dataLayer) {
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          items: [
            {
              item_id: reference.id,
              item_name: reference.title,
              affiliation: "Storefront",
              item_brand: "TOR",
              value: reference.priceRange.maxVariantPrice.amount,
              item_variant: reference.title,
              currency: "USD",
              item_category: reference.productType,
            },
          ],
        },
        'eventTimeout' : 1200
      });
    }
  }

  return (
    <Container maxW="container.lg" centerContent pt={20} pb={10}>
      <Stack
        direction={["column", "row"]}
        spacing={8}
        align={["center", "flex-start"]}
      >
        <NextLink href={`/product/${reference.handle}`} passHref>
          <AspectRatio ratio={1 / 1} boxSize={[320, 400]} cursor="pointer">
            <Image
              src={reference?.images.edges[0]?.node.url}
              alt={reference?.title}
            />
          </AspectRatio>
        </NextLink>
        <Stack pt={12}>
          <NextLink href={`/product/${reference.handle}`} passHref>
            <Stack cursor="pointer">
              <Heading maxW={480}>{reference?.title}</Heading>
              <Text maxW={500} noOfLines={4}>
                {reference.description}
              </Text>
              <Text fontSize={32} fontWeight={400}>
                {formatter.format(reference.priceRange.minVariantPrice.amount)}
                {reference.priceRange.minVariantPrice?.amount !==
                reference.priceRange.maxVariantPrice.amount
                  ? ` - ${formatter.format(
                      reference.priceRange.maxVariantPrice.amount
                    )}`
                  : ""}
                {reference.compareAtPriceRange.maxVariantPrice.amount !==
                  "0.0" &&
                  reference.compareAtPriceRange.maxVariantPrice.amount !==
                    reference.compareAtPriceRange.maxVariantPrice.amount && (
                    <span
                      style={{
                        textDecoration: "line-through",
                        marginLeft: 12,
                        opacity: 0.4,
                        fontSize: 18,
                      }}
                    >
                      {formatter.format(
                        reference.compareAtPriceRange.maxVariantPrice.amount
                      )}
                    </span>
                  )}
              </Text>
            </Stack>
          </NextLink>
          <Button onClick={handleAddToCart} alignSelf={"flex-start"}>Add To Cart</Button>
        </Stack>
      </Stack>
      <Divider mt={20} />
    </Container>
  );
}
