import {
  Container,
  Text,
  Link,
  Stack,
  AspectRatio,
  Image,
  Divider,
  Icon,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useContext } from "react";
import { AiFillFacebook, AiFillInstagram, AiFillYoutube, AiOutlineFacebook } from "react-icons/ai";
import ShopContext from "../lib/shop-context";
import {
  BodyAndSkin,
  ByHairType,
  ByProductTypes,
  MoreLinks,
} from "./Menu/MenuSections";

const Footer = () => {
  const { shop } = useContext(ShopContext);

  return (
    <Container maxW="container.xl" py={10}>
      <Stack spacing={8}>
        <Stack w="full" direction={["column", "row"]} spacing={[8, 20]}>
          <AspectRatio ratio={8 / 10} w={"126px"}>
            <Image src="/tor-gif.gif" alt="TOR brand hairtypes gif" />
          </AspectRatio>
          <Stack>
            <Text fontSize="lg" fontFamily={"Futura"}>
              Learn
            </Text>
            <Divider />
            <FooterLink href="/salon-finder" text={"Salon Finder"} />
            <FooterLink href="/professionals" text={"Professionals"} />
            <FooterLink href="/blog" text={"Blog"} />
            <FooterLink href="/about" text={"About TOR"} />
          </Stack>
          <Stack>
            <Text fontSize="lg" fontFamily={"Futura"}>
              Communicate
            </Text>
            <Divider />
            <FooterLink href={"/help"} text={"Help & FAQ"} />
            <FooterLink href={"/contact"} text={"Contact"} />
            <FooterLink href={"/our-friends"} text={"Our Friends"} />
          </Stack>
          <Stack>
            <Text>Connect &amp; Share</Text>
            <Stack direction={["row"]}>
              <Link href="https://www.facebook.com/torproducts" target={"_blank"}>
                <Icon as={AiFillFacebook} boxSize={8} />
              </Link>
              <Link href="https://www.instagram.com/tor_salonproducts/" target={"_blank"}>
                <Icon as={AiFillInstagram} boxSize={8} />
              </Link>
              <Link href="https://www.youtube.com/channel/UCb-iMkFedO5bCd7p8t6atNg" target={"_blank"}>
                <Icon as={AiFillYoutube} boxSize={8} />
              </Link>
            </Stack>
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

const FooterShop = () => {
  return (
    <>
      <Text fontSize="lg" fontFamily={"Futura"}>
        Shop
      </Text>
      <Divider />
      <Stack direction={["column", "row"]} spacing={[8, 10]} fontSize="sm">
        <Stack>
          <Text fontWeight={600}>By Product Type</Text>
          <ByProductTypes />
        </Stack>
        <Stack>
          <Text fontWeight={600}>By Hair Type</Text>
          <ByHairType />
        </Stack>
        <Stack>
          <Text fontWeight={600}>Body + Skin</Text>
          <BodyAndSkin />
        </Stack>
        <Stack>
          <Text fontWeight={600}>More</Text>
          <MoreLinks />
        </Stack>
      </Stack>
    </>
  );
};
