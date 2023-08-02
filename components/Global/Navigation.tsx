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
import { AnimatePresence, motion, useAnimation, useCycle } from "framer-motion";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import AuthContext from "../../lib/auth-context";
import { MenuProps } from "../../types/app_types";
import Cart from "../Cart/Cart";
import MobileMenu from "../Menu/MobileMenu";
import { Search } from "../Search";

const MotionBox = motion<BoxProps>(Box);

export default function Navigation({ menu }: MenuProps) {
  const [open, cycleOpen] = useCycle(false, true);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  return (
    <Box
      p={7}
      pos="sticky"
      top={0}
      zIndex={20}
      bg="white"
      shadow={open ? "" : "md"}
    >
      <Flex justify={"space-between"} width="full">
        {menu && <MobileMenu menu={menu} />}
        <Stack
          direction={"row"}
          align="center"
          gap={6}
          display={["none", null, null, "inherit"]}
          width="full"
        >
          <Logo />
          <Stack
            direction="row"
            align="center"
            onMouseEnter={() => cycleOpen()}
            gap={0}
          >
            <Text>Shop</Text>
            <Icon as={BiChevronDown} />
          </Stack>
          {menu && menu.links.map((link) => (
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
          <Search />
          <Auth />
          <Cart />
        </Stack>
      </Flex>
      <AnimatePresence>
        {open && (
          <MotionBox
            pos="absolute"
            right={0}
            top={20}
            w="100vw"
            bg="white"
            shadow={"md"}
            pt={6}
            pb={12}
            zIndex={1}
            onMouseLeave={() => cycleOpen()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.3 } }}
            px={10}
          >
            <Stack direction="row" gap={16}>
              {menu && menu.mega_menu
                .filter((item) => item._type === "collectionGroup")
                .map((item) => (
                  <Stack key={item._key}>
                    <Text fontWeight={600}>{item.title}</Text>
                    {item.collectionLinks!.map((link) => (
                      <NextLink
                        legacyBehavior
                        key={link._id}
                        href={`/${link._type}/${link.store.slug.current}`}
                        passHref
                      >
                        <Link>{link.store.title}</Link>
                      </NextLink>
                    ))}
                  </Stack>
                ))}
              <Stack>
                <Text fontWeight={600}>More</Text>
                {menu && menu.mega_menu
                  .filter(
                    (item) =>
                      item._type === "linkExternal" ||
                      item._type === "linkInternal"
                  )
                  .map((item) => (
                    <NextLink
                      legacyBehavior
                      href={item.url}
                      key={item._key}
                      target={item.newWindow ? "_blank" : "_self"}
                    >
                      <Link>{item.title}</Link>
                    </NextLink>
                  ))}
              </Stack>
            </Stack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}

const Logo = () => {
  return (
    <Box>
      <NextLink href="/">
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
