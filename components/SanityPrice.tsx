import formatter from "lib/formatter";

export function SanityPrice({ product }: { product: any }) {
  return (
    <p className="mt-2">
      {formatter.format(product.priceRange.minVariantPrice)}
      {product.priceRange.minVariantPrice !== product.priceRange.maxVariantPrice
        ? ` - ${formatter.format(product.priceRange.maxVariantPrice)}`
        : ""}
      {product.compareAtPriceRange?.maxVariantPrice !== "0.0" &&
        product.compareAtPriceRange?.maxVariantPrice !==
          product.priceRange.maxVariantPrice &&
        product.compareAtPriceRange && (
          <span
            style={{
              textDecoration: "line-through",
              marginLeft: 12,
              opacity: 0.4,
              fontSize: 18,
            }}
          >
            {formatter.format(product.compareAtPriceRange?.maxVariantPrice)}
          </span>
        )}
    </p>
  );
}
