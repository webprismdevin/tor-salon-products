import { Skeleton } from "@chakra-ui/react";

export default function ProductCard({}) {
  return (
    <div className="grid py-4 px-3 border-2 border-black">
      <Skeleton height="400px" width="300px" />
      <Skeleton height="20px" width="200px" />
      <Skeleton height="20px" width="100px" />
      <AddToCart />
    </div>
  );
}

export function AddToCart() {
  return (
    <button className="w-full bg-black text-white py-2">Add to cart</button>
  );
}
