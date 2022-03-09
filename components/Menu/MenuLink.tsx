import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

export interface MenuItemProps {
  text: string;
  href: string;
}

export default function MenuLink({ text, href }: MenuItemProps) {
  return (
    <NextLink href={href} passHref>
      <Link>{text}</Link>
    </NextLink>
  );
}
