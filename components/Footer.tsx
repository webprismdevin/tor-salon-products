import {
  Flex,
  HStack,
  Container,
  Text,
  useColorMode,
  Icon,
  Link,
} from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import NextLink from 'next/link'
import { useContext } from "react";
import ShopContext from "../lib/shop-context";

const Footer = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { shop } = useContext(ShopContext)

  return (
    <Flex
      w="full"
      p={16}
      justifyContent={"space-between"}
    >
      <HStack>
        <Text>© {shop.name}. 2022. Crafted by <NextLink href="https://webprism.co" passHref><Link>WEBPRISM</Link></NextLink></Text>
      </HStack>
      <Icon
        onClick={toggleColorMode}
        as={colorMode === "dark" ? FaMoon : FaSun}
        h={4}
        w={4}
        cursor={"pointer"}
      />
    </Flex>
  );
};

export default Footer;
