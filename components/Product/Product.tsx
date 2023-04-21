import {
  Text,
  GridItem,
  AspectRatio,
  Image,
  Link,
  Button,
} from "@chakra-ui/react";
import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  ShopifyAddToCartPayload,
  ShopifyAnalyticsProduct,
} from "@shopify/hydrogen-react";
import CartContext from "lib/CartContext";
import useAddToCart from "lib/useAddToCart";
import NextLink from "next/link";
import { useContext } from "react";
import formatter from "../../lib/formatter";

const Product = ({
  product,
  fontSize,
  analytics,
}: {
  product: any;
  fontSize?: number;
  analytics?: any;
}) => {
  const { addItemToCart } = useAddToCart();
  const prod = product.node;
  const { cart } = useContext(CartContext);

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: prod.id,
    variantGid: prod.variants.edges[0].node.id,
    name: prod.title,
    variantName: prod.variants.edges[0].node.title,
    brand: prod.vendor,
    price: prod.priceRange.minVariantPrice.amount,
  };

  const handleAddToCart = () => {
    if (productAnalytics) {
      const payload: ShopifyAddToCartPayload = {
        ...getClientBrowserParameters(),
        ...analytics,
        cartId: cart?.id,
        products: [
          {
            productAnalytics,
            quantity: 1,
          },
        ],
      };

      sendShopifyAnalytics({
        eventName: AnalyticsEventName.ADD_TO_CART,
        payload,
      });

      console.log("add to cart sent", payload);
    }

    addItemToCart(prod.variants.edges[0].node.id, 1, "");
  };

  return (
    <GridItem
      colSpan={[3, 3, 3, 1]}
      textAlign="center"
      placeItems={"center"}
      display={"grid"}
      pos={"relative"}
      cursor={"pointer"}
    >
      <NextLink href={`/product/${prod.handle}`} passHref>
        <AspectRatio ratio={1 / 1} boxSize={300} mb={4}>
          <Image
            src={prod.images.edges[0]?.node.url}
            alt={prod.title}
            borderRadius={6}
          />
        </AspectRatio>
      </NextLink>
      <NextLink href={`/product/${prod.handle}`} passHref legacyBehavior>
        <Link fontSize={[24, null, 32]} maxW="300px" lineHeight={1.3}>
          {prod.title}
        </Link>
      </NextLink>
      <Text mt={2}>
        {formatter.format(prod.priceRange.minVariantPrice.amount)}
        {prod.priceRange.minVariantPrice?.amount !==
        prod.priceRange.maxVariantPrice.amount
          ? ` - ${formatter.format(prod.priceRange.maxVariantPrice.amount)}`
          : ""}
        {prod.compareAtPriceRange?.maxVariantPrice.amount !== "0.0" &&
          prod.compareAtPriceRange?.maxVariantPrice.amount !==
            prod.priceRange.maxVariantPrice.amount && (
            <span
              style={{
                textDecoration: "line-through",
                marginLeft: 12,
                opacity: 0.4,
                fontSize: 18,
              }}
            >
              {formatter.format(
                prod.compareAtPriceRange?.maxVariantPrice.amount
              )}
            </span>
          )}
      </Text>
      {prod.variants.edges?.length === 1 ? (
        <Button onClick={handleAddToCart} mt={4} size="lg">
          Add To Cart
        </Button>
      ) : (
        <NextLink href={`/product/${prod.handle}`}>
          <Button mt={4} size="lg">
            Select Size
          </Button>
        </NextLink>
      )}
    </GridItem>
  );
};

export default Product;
