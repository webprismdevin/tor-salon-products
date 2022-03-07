import {
  Box,
  Icon,
  Stack,
  Image,
  Flex,
  Text,
  Container,
  Link,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  BoxProps,
  Divider,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Search } from "./Search";

const Cart = dynamic(() => import("../components/Cart"));

const MotionBox = motion<BoxProps>(Box);

const variants = {
  initial: {
    display: "none",
    opacity: 0,
  },
  animate: {
    display: "inherit",
    opacity: 1,
  },
  exit: {
    display: "none",
    opacity: 0,
    transition: {
      display: { delay: 0.4 },
      opacity: { delay: 0 },
    },
  },
};

const NavBar = () => {
  const [auth, setAuth] = useState(false);
  const router = useRouter();
  const controls = useAnimation();

  useEffect(() => {
    async function checkToken() {
      let token = JSON.parse(
        window.localStorage.getItem(
          `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`
        ) as any
      );

      if (token) setAuth(true);

      console.log(token);
    }

    checkToken();

    controls.start("initial");
  }, []);

  function handleLoginOrAccount() {
    if (auth) router.push("/account");
    else router.push("/login");
  }

  return (
    <Box py={6} px={[4, 10]} pos="sticky" top={0} zIndex={1} bg="white">
      <Container maxW="container.xl">
        <Flex align={"center"} justify={"space-between"}>
          <Stack direction="row" spacing={8}>
            <StoreName />
            <Text onMouseEnter={() => controls.start("animate")}>Shop</Text>
          </Stack>
          <Stack direction="row" spacing={4}>
            <Box>
              <Menu>
                <MenuButton>Salons</MenuButton>
                <MenuList>
                  <MenuItem>Salon Finder</MenuItem>
                  <MenuItem>Salon Professionals</MenuItem>
                </MenuList>
              </Menu>
            </Box>
            <NextLink href="/about" passHref>
              <Link>About</Link>
            </NextLink>
            <Icon
              as={AiOutlineUser}
              boxSize={6}
              onClick={handleLoginOrAccount}
              _hover={{
                opacity: 0.4,
              }}
              transition={"opacity 200ms ease"}
            />
            <Search router={router} />
            <Cart />
          </Stack>
        </Flex>
      </Container>
      <AnimatePresence exitBeforeEnter={true}>
        <MotionBox
          pos="absolute"
          left={0}
          top={20}
          w="100vw"
          bg="white"
          // outline="1px solid black"
          shadow={"md"}
          py={6}
          zIndex={1}
          animate={controls}
          variants={variants}
          onMouseLeave={() => controls.start("exit")}
        >
          <Container maxW="container.xl">
            <Stack direction="row" spacing={24}>
              <Stack>
                <Text fontSize={"xl"}>Hair Care</Text>
                <Divider />
                <Stack direction="row" spacing={12}>
                  <Stack>
                    <Text fontWeight={600}>Shop by Product Type</Text>
                    <Link>Shampoo</Link>
                    <Link>Conditioner</Link>
                    <Link>Co-washes</Link>
                    <Link>Styling Products</Link>
                  </Stack>
                  <Stack>
                    <Text fontWeight={600}>Shop by Hair Type</Text>
                    <Link>Curly</Link>
                    <Link>Medium &amp; Thick</Link>
                    <NextLink href="/collection/fine-thin-hair-line" passHref>
                      <Link>Fine &amp; Thin</Link>
                    </NextLink>
                  </Stack>
                </Stack>
              </Stack>
              <Stack>
                <Text fontSize={"xl"}>Body + Skin</Text>
                <Divider />
                <Link>Lip Balm</Link>
                <Link>Goat&apos;s Milk Soap</Link>
              </Stack>
              <Stack>
                <Text fontSize={"xl"}>More</Text>
                <Divider />
                <Link>CBD Products</Link>
                <Link>Gift Bundles</Link>
                <Link>Candles</Link>
                <Link>Gift Cards</Link>
              </Stack>
            </Stack>
          </Container>
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

export default NavBar;

const StoreName = () => {
  return (
    <Box justifySelf={"center"}>
      <NextLink href="/" passHref>
        <Image src={"/logo_800.png"} h={7} alt="TOR logo" />
      </NextLink>
    </Box>
  );
};
