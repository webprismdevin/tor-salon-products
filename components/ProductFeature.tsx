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
} from "@chakra-ui/react";
import NextLink from "next/link";
import AddToCart from "./AddToCart";
import formatter from "../lib/formatter";

export default function ProductFeature({ reference }: any) {
  return (
    <Container maxW="container.lg" centerContent pt={20} pb={10}>
      <Stack
        direction={["column", "row"]}
        spacing={8}
        align={["center", "flex-start"]}
      >
        <NextLink href={`/product/${reference.handle}`} passHref>
          <AspectRatio ratio={1 / 1} boxSize={[320, 400]}  cursor="pointer">
            <Image
              src={reference?.images.edges[0].node.url}
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
              <Text fontSize={32} fontWeight={600}>
                {formatter.format(
                  reference.variants.edges[0].node.priceV2.amount
                )}
              </Text>
            </Stack>
          </NextLink>
          <AddToCart variant={reference.variants.edges[0].node.id} />
        </Stack>
      </Stack>
      <Divider mt={20} />
    </Container>
  );
}
