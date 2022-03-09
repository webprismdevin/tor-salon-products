import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Link, useColorModeValue } from "@chakra-ui/react";
import formatter from "../lib/formatter";
import NextLink from 'next/link'

export type ProductProps = {
  product: any;
};

export default function Product({ product }: ProductProps) {
  const router = useRouter();

  const textColor = useColorModeValue("black", "white");

  return (
    <NextLink href={`/product/${product.node.handle}`} passHref>
      <Link>{product.node.title}</Link>
    </NextLink>
  );
}
