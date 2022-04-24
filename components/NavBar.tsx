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
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Search } from "./Search";
import MobileMenu from "./Menu/MobileMenu";
import DesktopMenu from "./Menu/DesktopMenu";
import MenuLink from "./Menu/MenuLink";
import { isMobile } from "react-device-detect";

const Cart = dynamic(() => import("../components/Cart"));

const NavBar = () => {
  const [auth, setAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {

    async function checkToken() {
      let token = JSON.parse(
        window.localStorage.getItem(
          `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`
        ) as any
      );

      if (token) setAuth(true);
    }

    checkToken();
  }, []);

  function handleLoginOrAccount() {
    if (auth) router.push("/account");
    else router.push("/login");
  }

  return (
    <Box
      py={6}
      px={[4, 10]}
      pos="sticky"
      top={0}
      zIndex={2}
      bg="white"
      borderBottom={"2px solid black"}
    >
      <Flex align={"center"} justify={"space-between"}>
        <Stack direction="row" spacing={[4, 8]} align={"center"}>
          {isMobile && 
          <MobileMenu />
          }
          <StoreName />
          {/* {!isMobile &&  */}
          <DesktopMenu />
          {/* } */}
        </Stack>
        <Stack direction="row" spacing={4}>
          {/* {!isMobile && ( */}
          <>
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
            <Link display={["none", "inherit"]}>
              <NextLink href="/about" passHref>
                About
              </NextLink>
            </Link>
          </>
          {/* )} */}
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
    </Box>
  );
};

export default NavBar;

const StoreName = () => {
  return (
    <Box>
      <NextLink href="/" passHref>
        <Image src={"/logo_800.png"} h={7} alt="TOR logo" />
      </NextLink>
    </Box>
  );
};
