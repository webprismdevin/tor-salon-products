import {
  Flex,
  Box,
  Heading,
  Icon,
  Stack,
  Image,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useState, useRef, useEffect } from "react";
import { AiOutlineUser, AiOutlineQuestion } from "react-icons/ai";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Search } from "./Search";

const Menu = dynamic(() => import("../components/Menu"));
const Cart = dynamic(() => import("../components/Cart"));

const NavBar = () => {
  const [showSearch, setSearch] = useState(false);
  const [auth, setAuth] = useState(false);
  const router = useRouter();

  const searchRef = useRef<any>();

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
  }, []);

  function handleLoginOrAccount() {
    if (auth) router.push("/account");
    else router.push("/login");
  }

  return (
    // <Flex
    //   justifyContent="space-between"
    //   alignItems={["center"]}
    //   px={[4, 10]}
    //   py={4}
    //   pos={["sticky"]}
    //   zIndex={1}
    //   top={0}
    //   left={0}
    //   style={{ backdropFilter: "blur(1spx)" }}
    //   // flexWrap="wrap"
    // >
    <SimpleGrid templateColumns={"repeat(3, 1fr)"} w="full" py={4} px={[4, 10]}>
      <GridItem display="flex" justifyContent={"flex-start"} alignItems={"center"}>
        <Menu />
      </GridItem>
      <GridItem display="flex" justifyContent={"center"} alignItems={"center"}>
        <StoreName />
      </GridItem>
      <GridItem display="flex" justifyContent={"flex-end"} alignItems={"center"}>
        <Stack spacing={3} direction={"row"} justifyContent={"flex-end"} w="full">
          <Search router={router} />
          <Icon
            as={AiOutlineUser}
            boxSize={6}
            onClick={handleLoginOrAccount}
            _hover={{
              opacity: 0.4,
            }}
            transition={"opacity 200ms ease"}
          />
          <NextLink href="/faq" passHref>
            <Icon
              as={AiOutlineQuestion}
              boxSize={6}
              _hover={{
                opacity: 0.4,
              }}
              transition={"opacity 200ms ease"}
            />
          </NextLink>
          <Cart />
        </Stack>
      </GridItem>
    </SimpleGrid>
    // </Flex>
  );
};

export default NavBar;

const StoreName = () => {
  return (
    <Box justifySelf={"center"}>
      <NextLink href="/" passHref>
        {/* <Heading style={{ cursor: "pointer" }} size="lg">SuperShops</Heading> */}
        <Image src={"/logo_800.png"} h={7} alt="TOR logo" />
      </NextLink>
    </Box>
  );
};
