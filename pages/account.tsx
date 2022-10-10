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
  SimpleGrid,
  GridItem,
  Tag,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import NextLink from "next/link";
import Head from "next/head";
import Loader from "../components/Loader";
import AuthContext from "../lib/auth-context";

declare interface CustData {
  firstName: string;
  lastName: string;
  email: string;
  displayAddress: any;
  tags: [string];
}

export default function Account() {
  const router = useRouter();
  const [userData, setUserData] = useState<CustData | null>(null);
  const { user, setUser, token } = useContext(AuthContext);

  function logout() {
    window.localStorage.removeItem(
      `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`
    );

    setUser(null);

    router.push("/");
  }

  async function getUser(accessToken: string) {
    const user = await fetch(
      `/api/get-customer?accessToken=${accessToken}`
    ).then((res) => res.json());

    setUserData({ ...user.data.customer });
  }

  useEffect(() => {
    if (!token) return

    //check if token is still valid
    console.log(token)

    getUser(token?.customerAccessToken.accessToken);
  }, [token]);

  if (!userData || !user)
    return (
      <Container py={20} centerContent>
        <Loader />
      </Container>
    );

  if (userData && user)
    return (
      <Box pt={20} pb={40}>
        <Head>
          <title>My Account | TOR Salon Products</title>
        </Head>
        <Container maxW="container.xl" centerContent>
          <Stack spacing={10} w="full">
            <Flex justify={"space-between"}>
              <Heading>Account</Heading>
              <Stack direction={["column", null, null, "row"]} spacing={6}>
                {user.isPro && (
                  <Button onClick={() => router.push("/wholesale")}>
                    Shop Wholesale
                  </Button>
                )}
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </Stack>
            </Flex>
            <Divider />
            <SimpleGrid templateColumns={"repeat(3, 1fr)"}>
              <GridItem colSpan={[3, 1]}>
                <Stack>
                  {user.isPro && (
                    <Tag alignSelf="flex-start" size="lg">
                      Professional
                    </Tag>
                  )}
                  <Text fontWeight={500}>
                    {userData.firstName} {userData.lastName}
                  </Text>
                  <Text>{userData.email}</Text>
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
        <Heading mb={8} mt={[8, 0]} size="lg">
          Orders
        </Heading>
        <Stack>
          <SimpleGrid
            templateColumns={["repeat(3, 1fr)", "repeat(4, 1fr)"]}
            gap={[4]}
            columnGap={[4, 0]}
          >
            <GridItem fontWeight={600} pb={4}>
              Order Date
            </GridItem>
            <GridItem fontWeight={600} pb={4}>
              Status
            </GridItem>
            <GridItem fontWeight={600} pb={4} display={["none", "inherit"]}>
              Order #
            </GridItem>
            <GridItem fontWeight={600} pb={4}>
              Confirmation
            </GridItem>
            {userData.orders.edges.map((o: any, i: number) => (
              <>
                <GridItem>
                  {new Date(o.node.processedAt).toLocaleDateString()}
                </GridItem>
                <GridItem>{o.node.fulfillmentStatus}</GridItem>
                <GridItem display={["none", "inherit"]}>
                  {o.node.orderNumber}
                </GridItem>
                <GridItem textAlign={["center", "left"]}>
                  <Link>
                    <NextLink
                      href={`/order/${Buffer.from(o.node.id).toString(
                        "base64"
                      )}`}
                      passHref
                    >
                      <Text>View</Text>
                    </NextLink>
                  </Link>
                </GridItem>
              </>
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    );
  else return <Box>Something&apos;s wrong.</Box>;
}
