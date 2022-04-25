import MenuLink from "./MenuLink";
import { Link } from "@chakra-ui/react";

export const ByProductTypes = () => {
  return (
    <>
      <MenuLink href="/collection/co-washes" text="Co-washes" />
      <MenuLink href="/collection/conditioners" text="Conditioners" />
      <MenuLink href="/collection/shampoo" text="Shampoo" />
      <MenuLink href="/collection/styling" text="Styling" />
    </>
  );
};

export const ByHairType = () => {
  return (
    <>
      <MenuLink href="/type/curly" text="Curly" />
      <MenuLink href="/type/fine-thin" text="Fine &amp; Thin" />
      <MenuLink href="/type/medium-thick" text="Medium &amp; Thick" />
    </>
  );
};

export const BodyAndSkin = () => {
  return (
    <>
      <MenuLink href="/product/cbd-bath-bombs" text="Bath Bombs" />
      <MenuLink href="/collection/cbd-consumables" text="Consumables" />
      <MenuLink href="/product/natural-lip-balm-with-cbd" text="Lip Balm" />
      <MenuLink href="/collection/cbd-lotions" text="Lotions" />
    </>
  );
};

export const MoreLinks = () => {
  return (
    <>
      <Link href="/search?query=candles">Candles</Link>
      <Link href="/search?query=goats%20milk%20soap">Goats Milk Soap</Link>
      <MenuLink href="/product/natural-lip-balm" text="Natural Lip Balm" />
      {/* <Link>Gift Bundles</Link> */}
      <MenuLink href="/gift-cards" text="Gift Cards" />
    </>
  );
};
