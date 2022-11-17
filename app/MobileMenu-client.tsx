"use client"
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
import { useRouter } from "next/navigation";
import { AiOutlineMenu } from "react-icons/ai";
import NextLink from "next/link";
import MenuLink from "../components/Menu/MenuLink";
import AuthContext from "../lib/auth-context";
import { CollectionLink } from "../types/sanity";
import useSWR from "swr";
import { sanity } from "../lib/sanity";

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

const MobileMenu = () => {
  const {
    isOpen: menuIsOpen,
    onOpen: menuOnOpen,
    onClose: menuOnClose,
  } = useDisclosure();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { data, error } = useSWR(settingsQuery, sanityFetcher);

  // useEffect(() => {
  //   router.events.on("routeChangeStart", menuOnClose);

  //   return () => {
  //     router.events.off("routeChangeStart", menuOnClose);
  //   };
  // }, []);

  return (
    <>
      <Icon
        display={["inherit", "none"]}
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
            <Text fontFamily={"Futura"}>TOR</Text>
          </DrawerHeader>
          <DrawerBody p={8}>
            <VStack spacing={4} alignItems={"flex-start"} w="full">
              <MenuLink href="/" text="Home" />
              <Box w="full" mb={6}>
                <Text fontWeight={600} mb={2}>
                  Shop
                </Text>
                <Accordion w="full" allowToggle>
                  {data && data.menu.mega_menu
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
                        {data && data.menu.mega_menu
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
              {data && data.menu.links.map((link) => (
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
