import { Text, GridItem, AspectRatio, Image } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

const Product = ({
  product,
  fontSize,
}: {
  product: any;
  fontSize?: number;
}) => {
  const prod = product.node;
  const router = useRouter();

  return (
    <GridItem
      onClick={() => router.push(`/product/${prod.handle}`)}
      colSpan={[3, 1]}
      textAlign="center"
      placeItems={"center"}
      display={"grid"}
      pos={"relative"}
      cursor={"pointer"}
    >
      <AspectRatio ratio={1 / 1} boxSize={300}>
        <Image src={prod.images.edges[0]?.node.url} alt={prod.title} borderRadius={6} />
      </AspectRatio>
      <Text fontSize={fontSize ? fontSize : 32} maxW="300px" lineHeight={1.3} minH={["none", 84]}>
        {prod.title}
      </Text>
    </GridItem>
  );
};

export default Product;
