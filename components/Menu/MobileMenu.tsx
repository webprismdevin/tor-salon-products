import {
  VStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Icon,
  Link
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AiOutlineMenu } from "react-icons/ai";
import NextLink from "next/link";
import MenuLink from "./MenuLink";
import AuthContext from "../../lib/auth-context";
import { MenuProps } from "../../types/app_types";
import { CollectionLink } from "../../types/sanity";
import { Logo } from "components/Global/Navigation";

const MobileMenu = ({ menu }: MenuProps) => {
  const {
    isOpen: menuIsOpen,
    onOpen: menuOnOpen,
    onClose: menuOnClose,
  } = useDisclosure();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    router.events.on("routeChangeStart", menuOnClose);

    return () => {
      router.events.off("routeChangeStart", menuOnClose);
    };
  }, []);

  return (
    <>
      <div className="flex gap-4 md:hidden">
        <Icon
          as={AiOutlineMenu}
          onClick={menuOnOpen}
          style={{
            cursor: "pointer",
          }}
          boxSize={[6]}
          _hover={{
            opacity: 0.4,
          }}
          transition={"opacity 200ms ease"}
        />
        <Logo />
      </div>
      <Drawer
        isOpen={menuIsOpen}
        placement="left"
        onClose={menuOnClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Text fontFamily={"Futura"}>TOR Salon Products</Text>
          </DrawerHeader>
          <DrawerBody p={8}>
            <VStack spacing={4} alignItems={"flex-start"} w="full">
              <MenuLink href="/" text="Home" />
              <Box w="full" mb={6}>
                <Text fontWeight={600} mb={2}>
                  Shop
                </Text>
                <Accordion w="full" allowToggle>
                  {menu && menu.mega_menu
                    .filter((item) => item._type === "collectionGroup")
                    .map((item) => (
                      <AccordionItem key={item._key}>
                        <h2>
                          <AccordionButton px={0}>
                            <Box flex="1" textAlign="left">
                              {item.title}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel>
                          <Stack>
                            {item.collectionLinks!.map((link: CollectionLink) => (
                              <NextLink
                                key={link._id}
                                href={`/${link._type}/${link.store.slug.current}`}
                                passHref
                              >
                                <Link>{link.store.title}</Link>
                              </NextLink>
                            ))}
                          </Stack>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  <AccordionItem>
                    <h2>
                      <AccordionButton px={0}>
                        <Box flex="1" textAlign="left">
                          More
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      <Stack>
                        {menu && menu.mega_menu
                          .filter(
                            (item) =>
                              item._type === "linkExternal" ||
                              item._type === "linkInternal"
                          )
                          .map((item) => (
                            <NextLink
                              href={item.url}
                              key={item._key}
                              target={item.newWindow ? "_blank" : "_self"}
                            >
                              <Link>{item.title}</Link>
                            </NextLink>
                          ))}
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
              {menu && menu.links.map((link) => (
                <NextLink
                  href={link.url}
                  key={link._key}
                  passHref
                  target={link.newWindow ? "_blank" : "_self"}
                >
                  <Link>{link.title}</Link>
                </NextLink>
              ))}
              <MenuLink href="/account" text="Account" />
              <MenuLink href={"/help"} text="Help &amp; FAQ" />
              {user && user.isPro && (
                <MenuLink href="/wholesale" text="Wholesale" />
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileMenu;
