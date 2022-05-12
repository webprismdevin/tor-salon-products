import { Box } from '@chakra-ui/react'

export default function ReviewsMain({product, handle} : { product: any, handle: string }) {

  return (
    <Box
      className="yotpo yotpo-main-widget"
      data-product-id={product.id.split("/")[4]}
      data-price={product.priceRange.maxVariantPrice.amount}
      data-currency={"USD"}
      data-name={product.title}
      data-url={`${process.env.NODE_ENV === "production" ? "https://torsalonproducts.com/product/" : "http://localhost:3000" }/${handle}`}
      data-image-url={product.images.edges[0]?.node.url}
    />
  );
}
