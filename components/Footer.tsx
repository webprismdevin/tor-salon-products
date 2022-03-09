import {
  Container,
  Text,
  Link,
  Stack,
  AspectRatio,
  Image,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useContext } from "react";
import ShopContext from "../lib/shop-context";

const Footer = () => {
  const { shop } = useContext(ShopContext);

  return (
    <Container maxW="container.xl" py={10}>
      <Stack spacing={8}>
        <Stack direction={["column", "row"]} spacing={[8, 20]}>
          <AspectRatio ratio={8 / 10} w={"126px"}>
            <Image src="/tor-gif.gif" alt="TOR brand hairtypes gif" />
          </AspectRatio>
          <Stack>
            <Text fontSize="lg" fontFamily={"Futura"}>
              Shop
            </Text>
            <FooterLink href="/collection/shampoo" text={"Shampoo"} />
            <FooterLink href="/collection/conditioners" text={"Conditioners"} />
            <FooterLink href="/collection/co-washes" text={"Co-washes"} />
            <FooterLink href="/collection/styling-products" text={"Styling Products"} />
          </Stack>
          <Stack>
            <Text fontSize="lg" fontFamily={"Futura"}>
              Learn
            </Text>
            <FooterLink href="/salon-finder" text={"Salon Finder"} />
            <FooterLink href="/professionals" text={"Professionals"} />
            <FooterLink href="/blog" text={"Blog"} />
            <FooterLink href="/about" text={"About TOR"} />
          </Stack>
          <Stack>
            <Text fontSize="lg" fontFamily={"Futura"}>
              Communicate
            </Text>
            <FooterLink href={"/help"} text={"Help & FAQ"} />
            <FooterLink href={"/contact"} text={"Contact"} />
            <FooterLink href={"/our-friends"} text={"Our Friends"} />
          </Stack>
        </Stack>
        <Text w="full" textAlign={"center"} fontSize="xs">
          © {shop.name}. 2022. Crafted by{" "}
          <NextLink href="https://webprism.co" passHref>
            <Link>WEBPRISM</Link>
          </NextLink>
        </Text>
      </Stack>
    </Container>
  );
};

const FooterLink = ({ href, text }: { href: string; text: string }) => {
  return (
    <NextLink href={href} passHref>
      <Link fontSize="sm">{text}</Link>
    </NextLink>
  );
};

export default Footer;
