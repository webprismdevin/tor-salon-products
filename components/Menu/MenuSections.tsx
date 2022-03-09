import MenuLink from "./MenuLink";
import { Link } from '@chakra-ui/react'

export const ByProductTypes = () => {
  return (
    <>
      <MenuLink href="/collection/shampoo" text="Shampoo" />
      <MenuLink href="/collection/conditioners" text="Conditioners" />
      <MenuLink href="/collection/co-washes" text="Co-washes" />
      <MenuLink href="/collection/styling-products" text="Styling Products" />
    </>
  );
};

export const ByHairType = () => {
  return (
    <>
      <MenuLink href="/collection/curly-hair-line" text="Curly" />
      <MenuLink
        href="/collection/medium-thick-hair-line"
        text="Medium &amp; Thick"
      />
      <MenuLink href="/collection/fine-thin-hair-line" text="Fine &amp; Thin" />
    </>
  );
};

export const BodyAndSkin = () => {
  return (
    <>
      <MenuLink href="/collection/lip-balm" text="Lip Balm" />
      <MenuLink href="/collection/goat-milk-soap" text="Goat Milk Soap" />
    </>
  );
};

export const MoreLinks = () => {
  return (
    <>
      <Link>Candles</Link>
      <Link>CBD Products</Link>
      <Link>Gift Bundles</Link>
      <Link>Gift Cards</Link>
    </>
  );
};
