import ProductCard from "./ProductCard";

export type ProductGridProps = {
  data: any;
};

export default function ProductGrid({ data }: ProductGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-12 place-items-center mx-auto p-4 md:p-12">
      {data.products.map((product: any) => {
        return <ProductCard key={product.gid} product={{
            gid: product.gid,
            title: product.title,
            featuredImage: product.featuredImage,
            price: product.priceRange.minVariantPrice,
            handle: product.handle,
        }} />;
      })}
    </div>
  );
}
