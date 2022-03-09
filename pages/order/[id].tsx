import {
  Heading,
  Text,
  Container,
  Divider,
  VStack,
  Link,
  Stack,
  Image,
  Box,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function ThankYou({ data }: any) {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    async function checkToken() {
      const token = JSON.parse(
        //@ts-ignore
        window.localStorage.getItem(
          `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`
        )
      );
      if (token) setAuth(true);
    }

    checkToken();
  }, []);

  if (!data) return null;

  return (
    <Container py={20} maxW="container.lg">
      <Head>
        <title>Thank You!</title>
      </Head>
      <VStack alignItems={"flex-start"} spacing={4} py={10}>
        <Heading>
          Thank you for your order, {data.displayAddress?.firstName}!
        </Heading>
        <Text>
          We appreciate your business, and look forward to sending you your
          product!
        </Text>
      </VStack>
      <Divider />
      <Stack direction={["column", "row"]} spacing={20}>
        <VStack alignItems={"flex-start"} spacing={4} py={10}>
          <Text fontSize="2xl" fontWeight={600}>
            Items
          </Text>
          {data.lineItems.edges.map((product: any) => (
            <LineItem key={product.node.id} product={product} />
          ))}
        </VStack>
        <VStack align={"flex-start"} py={10}>
          <ShippingDetails displayAddress={data.displayAddress} />
        </VStack>
      </Stack>
      {!auth && (
        <>
          <Divider />
          <VStack py={10}>
            <Text fontWeight={600}>Want to track your order?</Text>
            <Text>
              <NextLink href="/login" passHref>
                <Link>Create an account</Link>
              </NextLink>{" "}
              with the same email you used for your purchase. Or{" "}
              <NextLink href="/login" passHref>
                <Link>login</Link>
              </NextLink>
            </Text>
          </VStack>
        </>
      )}
    </Container>
  );
}

function ShippingDetails({ displayAddress }: any) {
  return (
    <>
      <Text fontSize={"2xl"} fontWeight={600}>
        Shipping
      </Text>
      <VStack spacing={1} alignItems={"flex-start"}>
        <Text fontWeight={500}>{displayAddress?.name}</Text>
        <Text>{displayAddress?.address1}</Text>
        {displayAddress?.address2 !== "" && (
          <Text>{displayAddress?.address2}</Text>
        )}
        <Text>
          {displayAddress?.city}, {displayAddress?.province}
        </Text>
        <Text>
          {displayAddress?.zip}, {displayAddress?.country}
        </Text>
      </VStack>
    </>
  );
}

function LineItem({ product }: any) {
  return (
    <Stack direction={["column", "row"]} alignItems={"flex-start"} py={4}>
      <Image
        boxSize={20}
        src={product.node.image.url}
        alt={product.node.name}
      />
      <Box>
        <Text fontWeight={600}>{product.node.name}</Text>
        <Text>Qty: {product.node.currentQuantity}</Text>
      </Box>
    </Stack>
  );
}

export async function getServerSideProps(context: any) {
  const base_url =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SHOPIFY_URL
      : "http://localhost:3000";

  const result = await fetch(
    `${base_url}/api/get-order?orderId=${context.params.id}`
  ).then((res) => res.json());

  return {
    props: {
      data: result.response.order,
    },
  };
}
