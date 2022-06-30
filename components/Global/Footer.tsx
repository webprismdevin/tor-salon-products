import {
  Container,
  Text,
  Link,
  Stack,
  AspectRatio,
  Img,
  Divider,
  Icon,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useContext, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import {
  SiGooglemybusiness,
  SiFacebook,
  SiInstagram,
  SiYoutube,
} from "react-icons/si";
import ShopContext from "../../lib/shop-context";
import {
  BodyAndSkin,
  ByHairType,
  ByProductTypes,
  MoreLinks,
} from "../Menu/MenuSections";
import NextImage from 'next/image'

const Footer = () => {
  const { shop } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [formStatus, setStatus] = useState("clean");

  async function subscribe() {
    setStatus("loading");

    const response = await fetch("/api/addsubscriber", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    }).then((res) => res.json());

    if (!response) {
      setStatus("failure");
    }

    if (response) {
      setEmail("");
      setStatus("success");
      if (process.env.NODE_ENV === "production") {
        window.dataLayer.push({
          event: "join_email_list",
          signUpMethod: "popup",
          callback: () => console.log("fired join_email_list event to GTM"),
        });
      }
    }
  }

  function handleEnter(event: any) {
    if (event.code === "Enter") {
      subscribe();
    }
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Stack spacing={8}>
        <Box maxW="500px" mb={"80px"}>
          <InputGroup>
            <Input
              variant={"unstyled"}
              fontSize={[24, 36]}
              placeholder={
                formStatus === "success"
                  ? "Check your inbox!"
                  : "Join our community"
              }
              _placeholder={{ color: "black" }}
              borderBottom={"4px solid black"}
              borderRadius={0}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleEnter}
            />
            <InputRightElement onClick={subscribe}>
              {formStatus === "loading" ? (
                <Spinner boxSize={6} mt={6} />
              ) : (
                <Icon as={FiArrowRight} boxSize={6} mt={[0, 6]} />
              )}
            </InputRightElement>
          </InputGroup>
        </Box>
        <Stack
          w="full"
          direction={["column", "row"]}
          justify={"space-between"}
          spacing={[8, 20]}
        >
          <Stack direction={["column", "row"]} spacing={[12, 20]}>
            <AspectRatio ratio={8 / 10} w={"126px"}>
              <NextImage src="/tor-gif.gif" alt="TOR brand hairtypes gif" layout="fill" />
            </AspectRatio>
            <Stack>
              <Text fontSize="lg" fontFamily={"Futura"}>
                Learn
              </Text>
              <Divider />
              <FooterLink href="/salon-finder" text={"Salon Finder"} />
              <FooterLink href="/professionals" text={"Professionals"} />
              {/* <FooterLink href="/blog" text={"Blog"} /> */}
              <FooterLink href="/about" text={"About TOR"} />
            </Stack>
            <Stack>
              <Text fontSize="lg" fontFamily={"Futura"}>
                Communicate
              </Text>
              <Divider />
              <FooterLink href={"/help"} text={"Help & FAQ"} />
              <Link
                fontSize="sm"
                onClick={() => process.browser && window.Tawk_API.maximize()}
              >
                Contact
              </Link>
              <Link
                fontSize={"sm"}
                href="https://dovetale.com/community/apply/GhTbYLIXsL4"
              >
                Ambassadors
              </Link>
              {/* <FooterLink href={"/our-friends"} text={"Our Friends"} /> */}
            </Stack>
          </Stack>
          <Stack>
            <Text fontSize="lg" fontFamily={"Futura"}>
              Connect &amp; Share
            </Text>
            <Divider />
            <Stack mt={2} direction={["row"]} spacing={4}>
              <Link
                href="https://www.facebook.com/torproducts"
                target={"_blank"}
              >
                <Icon as={SiFacebook} boxSize={6} />
              </Link>
              <Link
                href="https://www.instagram.com/tor_salonproducts/"
                target={"_blank"}
              >
                <Icon as={SiInstagram} boxSize={6} />
              </Link>
              <Link
                href="https://www.youtube.com/channel/UCb-iMkFedO5bCd7p8t6atNg"
                target={"_blank"}
              >
                <Icon as={SiYoutube} boxSize={6} />
              </Link>
              <Link
                href="https://www.youtube.com/channel/UCb-iMkFedO5bCd7p8t6atNg"
                target={"_blank"}
              >
                <Icon as={SiGooglemybusiness} boxSize={6} />
              </Link>
              <Link href="https://www.gab.com/TORProducts" target={"_blank"}>
                <Img
                  loading="lazy"
                  src="/gs-footer-icon.jpg"
                  alt="Gab Social Icon"
                  boxSize={6}
                />
              </Link>
            </Stack>
            <Text maxW={[240, 180]}>
              <Link href="https://www.google.com/maps?q=729+Main+Street,+Cañon+City,+CO+81212,+USA">
                729 Main Street, Cañon City, CO 81212
              </Link>
            </Text>
            <Text maxW={[240, 180]}>
              Phone: <Link href="tel:719-275-2582">719-275-2582</Link>
            </Text>
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
    <Stack>
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
    </Stack>
  );
};
