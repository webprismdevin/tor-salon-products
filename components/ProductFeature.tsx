import {
  Container,
  Heading,
  Text,
  Stack,
  AspectRatio,
  Image,
  Divider,
} from "@chakra-ui/react";
import getCollections from "../lib/get-collections";
import NextLink from "next/link";
import AddToCart from "./AddToCart";
import formatter from "../lib/formatter";


export default function ProductFeature({ reference }: any) {
  return (
    <Container maxW="container.lg" centerContent pt={20} pb={10}>
      <Stack direction="row" spacing={8}>
        <AspectRatio ratio={1 / 1} boxSize={400}>
          <Image
            src={reference.images.edges[0].node.url}
            alt={reference.title}
          />
        </AspectRatio>
        <Stack pt={12}>
          <Heading maxW={480}>{reference.title}</Heading>
          <Text maxW={500} noOfLines={4}>{reference.description}</Text>
          <NextLink href={`/product/${reference.handle}`}>Learn more</NextLink>
          <Text fontSize={32} fontWeight={600}>
            {formatter.format(reference.variants.edges[0].node.priceV2.amount)}
          </Text>
          <AddToCart variant={reference.variants.edges[0].node.id} />
        </Stack>
      </Stack>
      <Divider mt={20} />
    </Container>
  );
}
