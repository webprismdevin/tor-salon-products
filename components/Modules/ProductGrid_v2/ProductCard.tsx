import Image from "next/image";
import Link from "next/link";
import { Button } from "components/Button";
import { removeCents } from "lib/utils";

export type ProductCardProps = {
  product: {
    gid: string;
    title: string;
    featuredImage: string;
    price: number;
    handle: string;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.handle}`}>
      <div className="w-[260px] grid gap-3">
        <Image
          src={product.featuredImage}
          alt={product.title}
          width={320}
          height={320}
          className="mx-auto"
        />
        <h3 className="text-center text-lg line-clamp-2 h-14">
          {product.title}
        </h3>
        <Button width="full" variant="primary">
          <Price price={product.price} />
          &nbsp;|&nbsp;<span>Add To Cart</span>
        </Button>
      </div>
    </Link>
  );
}

export function Price({ price }: { price: number }) {
  return <span>${removeCents(price)}</span>;
}
