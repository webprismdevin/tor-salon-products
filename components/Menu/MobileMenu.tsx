import {
  VStack,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Link,
  Stack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineMenu } from "react-icons/ai";
import MenuLink from "./MenuLink";
import getCollections from "../../lib/get-collections";
import {
  BodyAndSkin,
  ByHairType,
  ByProductTypes,
  MoreLinks,
} from "./MenuSections";

const MobileMenu = () => {
  const {
    isOpen: menuIsOpen,
    onOpen: menuOnOpen,
    onClose: menuOnClose,
  } = useDisclosure();
  const router = useRouter();
  const [collections, setCollections] = useState<any>([]);

  useEffect(() => {
    router.events.on("routeChangeStart", menuOnClose);

    async function run() {
      const result = await getCollections("home");

      setCollections(result.collections.edges);
    }

    run();

    return () => {
      router.events.off("routeChangeStart", menuOnClose);
    };
  }, []);

  return (
    <>
      <Icon
        as={AiOutlineMenu}
        onClick={menuOnOpen}
        style={{
          cursor: "pointer",
        }}
        boxSize={6}
        _hover={{
          opacity: 0.4,
        }}
        transition={"opacity 200ms ease"}
        display={["inherit", "none"]}
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
          <DrawerHeader><Text fontFamily={"Futura"}>TOR</Text></DrawerHeader>
          <DrawerBody p={8}>
            <VStack spacing={4} alignItems={"flex-start"} w="full">
              <MenuLink href={"/"} text="Home" />
              <Box w="full">
                <Text fontWeight={600} mb={2}>Shop</Text>
                <Accordion w="full" allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton px={0}>
                        <Box flex="1" textAlign="left">
                          By Product Type
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      <Stack>
                        <ByProductTypes />
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton px={0}>
                        <Box flex="1" textAlign="left">
                          By Hair Type
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      <Stack>
                        <ByHairType />
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton px={0}>
                        <Box flex="1" textAlign="left">
                          CBD
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      <Stack>
                        <BodyAndSkin />
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
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
                      <MoreLinks />
                    </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
              <MenuLink href={"/salon-finder"} text="Salon Finder" />
              <MenuLink href={"/professionals"} text="Professionals" />
              {/* <MenuLink href={"/blog"} text="Blog" /> */}
              <MenuLink href={"/about"} text="About" />
              <MenuLink href={"/help"} text="Help &amp; FAQ" />
              </VStack>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileMenu;
