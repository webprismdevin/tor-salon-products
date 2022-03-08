import {
  VStack,
  Text,
  Icon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AiOutlineMenu } from "react-icons/ai";
import styles from "../styles/navbar.module.scss";
import Link from "next/link";
import getCollections from "../lib/get-collections";

const Menu = () => {
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
      />
      <Drawer
        isOpen={menuIsOpen}
        placement="left"
        onClose={menuOnClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>SuperShops</DrawerHeader>
          <DrawerBody p={8}>
            <VStack spacing={2} alignItems={"flex-start"}>
              <MenuItem url={"/"} text="Home" />
              <MenuItem url={"/all-products"} text="All Products" />
              {collections.length > 0 && (
                <>
                  <Divider />
                  <Heading size="md">Collections</Heading>
                  {collections.map((c: any) => (
                    <MenuItem
                      key={c.node.handle}
                      url={`/collection/${c.node.handle}`}
                      text={c.node.title}
                    />
                  ))}
                  <Divider />
                </>
              )}
              <MenuItem url={"/blog"} text="Blog" />
              <MenuItem url={"/about"} text="About" />
              <MenuItem url={"/faq"} text="FAQ" />
              <MenuItem url={"/contact"} text="Contact" />
            </VStack>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Menu;

const MenuItem = ({ url, text }: { url: string; text: string }) => {
  return (
    <Link href={url} passHref>
      <Text cursor={"pointer"} fontSize={["24px"]} className={styles.menuItem}>
        {text}
      </Text>
    </Link>
  );
};
