import {
  Text,
  GridItem,
  AspectRatio,
  Image,
} from "@chakra-ui/react";
import NextLink from "next/link";

const Product = ({ product, fontSize }: { product: any, fontSize?: number }) => {
  const prod = product.node;

  return (
    <NextLink href={`/product/${prod.handle}`} passHref>
      <GridItem
        colSpan={[3, 1]}
        textAlign="center"
        placeItems={"center"}
        display={"grid"}
        pos={"relative"}
        cursor={"pointer"}
      >
        <AspectRatio ratio={1 / 1} boxSize={300}>
          <Image src={prod.images.edges[0]?.node.url} alt={prod.title} />
        </AspectRatio>
        <Text fontSize={fontSize ? fontSize : 32} maxW="300px" lineHeight={1.3}>
          {prod.title}
        </Text>
      </GridItem>
    </NextLink>
  );
};

export default Product;