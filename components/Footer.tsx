import {
  Container,
  Text,
  Link,
  Stack,
  AspectRatio,
  Image
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useContext } from "react";
import ShopContext from "../lib/shop-context";

const Footer = () => {
  const { shop } = useContext(ShopContext);

  return (
    <Container maxW="container.xl" py={10}>
      <Stack spacing={8}>
        <Stack direction={["column", "row"]} spacing={20}>
          <AspectRatio ratio={8/10} w={"126px"}>
            <Image src="/tor-gif.gif" alt="TOR brand hairtypes gif" />
          </AspectRatio>
          <Stack>
            <Text fontSize="lg">Shop</Text>
            <Link fontSize="sm">Shampoo</Link>
            <Link fontSize="sm">Conditioners</Link>
            <Link fontSize="sm">Co-washes</Link>
            <Link fontSize="sm">Styling Products</Link>
          </Stack>
          <Stack>
            <Text fontSize="lg">Learn</Text>
            <Link fontSize="sm">Salon Finder</Link>
            <Link fontSize="sm">Salon Professionals</Link>
            <Link fontSize="sm">Blog</Link>
            <Link fontSize="sm">About TOR</Link>
          </Stack>
          <Stack>
            <Text fontSize="lg">Communicate</Text>
            <NextLink href="/help" passHref>
              <Link fontSize="sm">Help &amp; FAQ</Link>
            </NextLink>
            <Link fontSize="sm">Contact Us</Link>
            <Link fontSize="sm">Our Friends</Link>
          </Stack>
        </Stack>
        <Text w="full" textAlign={"center"}>
          © {shop.name}. 2022. Crafted by{" "}
          <NextLink href="https://webprism.co" passHref>
            <Link>WEBPRISM</Link>
          </NextLink>
        </Text>
      </Stack>
    </Container>
  );
};

export default Footer;
