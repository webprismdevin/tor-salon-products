import {
  Box,
  Icon,
  Stack,
  Image,
  Flex,
  Link,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  chakra,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useEffect, useContext } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/router";
import { Search } from "./Search";
import MobileMenu from "./Menu/MobileMenu";
import DesktopMenu from "./Menu/DesktopMenu";
import MenuLink from "./Menu/MenuLink";
import Cart from "./Cart";
import AuthContext from "../lib/auth-context";

const NavBar = () => {
  const router = useRouter();

  return (
    <Box
      py={6}
      px={[4, 10]}
      pos="sticky"
      top={0}
      left={0}
      zIndex={2}
      bg="white"
      borderBottom={"2px solid black"}
    >
      <Flex align={"center"} justify={"space-between"}>
        <Stack
          direction="row"
          spacing={[4, 0]}
          align={["center"]}
          justify={"flex-start"}
        >
          <MobileMenu />
          <StoreName />
          <DesktopMenu />
        </Stack>
        <Stack direction="row" spacing={4}>
          <Box display={["none", "inherit"]}>
            <Menu>
              <MenuButton>Salons</MenuButton>
              <MenuList>
                <MenuItem>
                  <MenuLink href="/salon-finder" text="Salon Finder" />
                </MenuItem>
                <MenuItem>
                  <MenuLink href="/professionals" text="Professionals" />
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
          <Box display={["none", "inherit"]}>
            <NextLink href="/about" passHref>
              <Link>About</Link>
            </NextLink>
          </Box>
          <Box display={["none", "inherit"]}>
            <NextLink href="/blog" passHref>
              <Link>Blog</Link>
            </NextLink>
          </Box>
          <Auth />
          <Search router={router} />
          <Cart />
        </Stack>
      </Flex>
    </Box>
  );
};

const Auth = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  // const [user, setUser, token] = useUser();

  function handleLoginOrAccount() {
    if (user && user.id) router.push("/account");
    else router.push("/login");
  }

  return (
    <Icon
      as={AiOutlineUser}
      boxSize={6}
      onClick={handleLoginOrAccount}
      _hover={{
        opacity: 0.4,
      }}
      transition={"opacity 200ms ease"}
    />
  );
};

export default NavBar;

const StoreName = () => {
  return (
    <Box order={[2]}>
      <NextLink href="/" passHref>
        <Image src={"/logo_240.png"} h={7} alt="TOR logo" />
      </NextLink>
    </Box>
  );
};
