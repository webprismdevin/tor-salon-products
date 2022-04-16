import {
  Container,
  Heading,
  Text,
  Stack,
  AspectRatio,
  Image,
  Divider,
  Link
} from "@chakra-ui/react";
import NextLink from "next/link";
import AddToCart from "./AddToCart";
import formatter from "../lib/formatter";


export default function ProductFeature({ reference }: any) {
  return (
    <Container maxW="container.lg" centerContent pt={20} pb={10}>
      <Stack direction={["column", "row"]} spacing={8} align={["center", "flex-start"]}>
        <AspectRatio ratio={1 / 1} boxSize={[320, 400]}>
          <Image
            src={reference.images.edges[0].node.url}
            alt={reference.title}
          />
        </AspectRatio>
        <Stack pt={12}>
          <NextLink href={`/product/${reference.handle}`} passHref>
            <Link>
              <Heading maxW={480}>{reference.title}</Heading>
            </Link>
          </NextLink>
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
