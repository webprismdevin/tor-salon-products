"use client"
import {
  Box,
  Stack,
  Img,
  Text,
  Icon,
  Link,
  BoxProps,
  Flex,
} from "@chakra-ui/react";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { use, useContext } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import AuthContext from "../lib/auth-context";
import { MenuProps } from "../types/app_types";
import Cart from "../components/Cart/Cart";
import MobileMenu from "../components/Menu/MobileMenu";
import { Search } from "./Search-client";
import { sanity } from "../lib/sanity";
import useSWR from "swr";
import MegaMenu from "./MegaMenu-client";

const sanityFetcher = (query: string) => sanity.fetch(query);
const settingsQuery = `*[ _type == "settings" ][0]
{ 
  menu { 
    mega_menu[]{
      ...,
      _type == 'collectionGroup' => @{ 
        collectionLinks[]-> 
      },
      _type != 'collectionGroup' => @
    },
    links[]{
      _type == 'reference' => @->,
      _type != 'reference' => @,
    }
  } 
}`;

export default function Navigation() {
  const { user } = useContext(AuthContext);
  const { data, error } = useSWR(settingsQuery, sanityFetcher);

  return (
    <Box
      p={7} 
      pos="sticky"
      top={0}
      zIndex={2}
      bg="white"
      shadow={"md"}
    >
      <Flex justify={"space-between"} width="full">
        {/* <MobileMenu menu={data.menu} /> */}
        <Stack
          direction={"row"}
          align="center"
          gap={6}
          display={["none", null, null, "inherit"]}
          width="full"
        >
          <Logo />
          <MegaMenu />
          {data && data.menu.links.map((link) => (
            <NextLink
              legacyBehavior
              href={link.url}
              key={link._key}
              passHref
            >
              <Link>{link.title}</Link>
            </NextLink>
          ))}
        </Stack>
        <Stack direction={"row"} align="center" gap={6}>
          {user && user.isPro && (
            <Box display={["none", "inherit"]}>
              <NextLink legacyBehavior href="wholesale">
                <Link>Wholesale</Link>
              </NextLink>
            </Box>
          )}
          <Search />
          <Auth />
          {/* <Cart /> */}
        </Stack>
      </Flex>

    </Box>
  );
}

const Logo = () => {
  return (
    <Box>
      <NextLink legacyBehavior href="/" passHref>
        <Img src={"/logo_240.png"} h={7} alt="TOR logo" />
      </NextLink>
    </Box>
  );
};

const Auth = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

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
