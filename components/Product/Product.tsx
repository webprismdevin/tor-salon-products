import { Text, GridItem, AspectRatio, Image } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import formatter from "../../lib/formatter";

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
    <NextLink href={`/product/${prod.handle}`} passHref>
      <GridItem
        colSpan={[3, 3, 3, 1]}
        textAlign="center"
        placeItems={"center"}
        display={"grid"}
        pos={"relative"}
        cursor={"pointer"}
      >
        <AspectRatio ratio={1 / 1} boxSize={300} mb={4}>
          <Image src={prod.images.edges[0]?.node.url} alt={prod.title} borderRadius={6} />
        </AspectRatio>
        <Text fontSize={fontSize ? fontSize : 32} maxW="300px" lineHeight={1.3} mb={2}>
          {prod.title}
        </Text>
        <Text>{formatter.format(prod.priceRange.minVariantPrice.amount)}{prod.priceRange.minVariantPrice?.amount !== prod.priceRange.maxVariantPrice.amount ? ` - ${formatter.format(prod.priceRange.maxVariantPrice.amount)}` : ""}{prod.compareAtPriceRange?.maxVariantPrice.amount !== "0.0" && <span style={{textDecoration: 'line-through', marginLeft: 12, opacity: 0.4, fontSize: 18}}>{formatter.format(prod.compareAtPriceRange?.maxVariantPrice.amount)}</span>}</Text>
      </GridItem>
    </NextLink>
  );
};

export default Product;