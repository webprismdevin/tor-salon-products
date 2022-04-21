import {
  Box,
  Heading,
  Text,
  Container,
  Divider,
  Stack,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Button,
  Link,
  HStack,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import formatter from "../lib/formatter";
import NextLink from "next/link";
import Head from "next/head";
import Loader from "../components/Loader";

declare interface CustData {
  firstName: string;
  lastName: string;
  email: string;
  displayAddress: any;
}

export default function Account() {
  const [authenticated, setAuth] = useState(false);
  const router = useRouter();
  const [userData, setUserData] = useState<CustData | null>(null);
  const [userAccess, setUserAccess] = useState({});

  useEffect(() => {
    async function checkToken() {
      let token = JSON.parse(
        //@ts-ignore
        window.localStorage.getItem(
          `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`
        )
      );

      if (token) setAuth(true);
      //todo: check expiresAt

      if (token === null) router.push("/login");
    }

    checkToken();
  }, []);

  function logout() {
    window.localStorage.removeItem(
      `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`
    );

    router.push("/");
  }

  async function getUser(accessToken: string) {
    const user = await fetch(
      `/api/get-customer?accessToken=${accessToken}`
    ).then((res) => res.json());
    setUserData({ ...user.data.customer });
  }

  useEffect(() => {
    if (authenticated) {
      let token = JSON.parse(
        //@ts-ignore
        window.localStorage.getItem(
          `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`
        )
      );

      console.log(token);

      getUser(token.accessToken);
    }
  }, [authenticated]);

  if (!authenticated) return <Loader />;

  if (userData)
    return (
      <Box pt={20} pb={40}>
        <Head>
          <title>{process.env.NEXT_PUBLIC_SHOP_NAME} | My Account</title>
        </Head>
        <Container maxW="container.xl" centerContent>
          <Stack spacing={10} w="full">
            <Flex justify={"space-between"}>
              <Heading>My Account</Heading>
              <Button onClick={logout}>Logout</Button>
            </Flex>
            <Divider />
            <SimpleGrid templateColumns={"repeat(3, 1fr)"}>
              <GridItem colSpan={[3, 1]}>
                <Stack>
                  <Text fontWeight={500}>
                    {userData.firstName} {userData.lastName}
                  </Text>
                  <Text>
                    {userData.displayAddress
                      ? userData.displayAddress
                      : "No default address"}
                  </Text>
                </Stack>
              </GridItem>
              <GridItem colSpan={[3, 2]}>
                <Orders userData={userData} />
              </GridItem>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    );

  if (!userData)
    return (
      <Box py={60}>
        <Container maxW="container.sm" centerContent>
          <Loader />
        </Container>
      </Box>
    );
}

function Name({ firstName }: { firstName: string }) {
  const [name, setName] = useState(firstName || "");

  useEffect(() => {
    console.log(name);
  }, [name]);

  return (
    <Box>
      <Text>Welcome!</Text>
      <Editable
        placeholder="Enter your first name"
        value={name}
        onChange={(value) => setName(value)}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Box>
  );
}

function Orders({ userData }: any) {
  if (!userData) return null;

  if (userData.orders.edges.length === 0)
    return <Box>You haven&apos;t made any purchases yet.</Box>;

  if (userData.orders.edges.length > 0)
    return (
      <Box>
        <Heading mb={8} size="lg">
          Orders
        </Heading>
        <Stack>
          <SimpleGrid
            templateColumns={"repeat(4, 1fr)"}
            gap={4}
          >
            <GridItem fontWeight={600} pb={4}>Order Date</GridItem>
            <GridItem fontWeight={600} pb={4}>Status</GridItem>
            <GridItem fontWeight={600} pb={4}>Order #</GridItem>
            <GridItem fontWeight={600} pb={4}>Confirmation</GridItem>
          {userData.orders.edges.map((o: any, i: number) => (
            <>
              <GridItem>
                {new Date(o.node.processedAt).toLocaleDateString()}
              </GridItem>
              <GridItem>{o.node.fulfillmentStatus}</GridItem>
              <GridItem>{o.node.orderNumber}</GridItem>
              <GridItem>
                <NextLink href={`/order/${Buffer.from(o.node.id).toString("base64")}`} passHref>
                  <Link>
                    <Text>View</Text>
                  </Link>
                </NextLink>
              </GridItem>
            </>
          ))}
          </SimpleGrid>
        </Stack>
      </Box>
    );
  else return <Box>Something&apos;s wrong.</Box>;
}

// Buffer.from(product.id).toString("base64")