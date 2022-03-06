import { Heading, Text, Container, Divider, VStack, Link, Stack } from "@chakra-ui/react";
import formatter from "../../lib/formatter";
import { GetServerSideProps } from "next";
import NextLink from 'next/link'
import Head from "next/head";

export default function ThankYou({data}: any) {
  if(!data) return null;

  return <Container py={80} maxW="container.lg">
      <Head>
          <title>Thank You!</title>
      </Head>
            <VStack alignItems={"flex-start"} spacing={4}>
                <Heading>Thank you for your order, {data.displayAddress.firstName}!</Heading>
                <Text>We appreciate your business, and look forward to sending you your product!</Text>
                <Divider />
                <VStack spacing={2} alignItems={"flex-start"}>
                    <Text fontSize="lg">Order Information</Text>
                    <Text>Shipping</Text>
                    <Text>{data.displayAddress.name}</Text>
                    <Text>{data.displayAddress.address1}</Text>
                    {data.displayAddress.address2 !== "" && <Text>{data.displayAddress.address2}</Text>}
                    <Text>{data.displayAddress.city}</Text>
                    <Text>{data.displayAddress.province}</Text>
                    <Text>{data.displayAddress.zip}</Text>
                    <Text>{data.displayAddress.country}</Text>
                </VStack>
                <Divider />
                <VStack alignItems={"flex-start"}>
                    <Text>Items</Text>
                    {data.lineItems.edges.map((product: any) => <LineItem key={product.node.id} product={product} />)}
                </VStack>
                <Divider />
                <Text>Want to track your order?</Text>
                <Text><NextLink href="/login"><Link>Create an account</Link></NextLink> with the same email you used for your purchase. Or <NextLink href="/login"><Link>login</Link></NextLink></Text>
            </VStack>
        </Container>;
}

function LineItem({ product }: any) {
  
    return (
        <Stack direction={"row"} alignItems={"flex-start"}>
            <Text fontWeight={600}>{product.node.name}</Text>
            <div>|</div>
            <Text>Qty: {product.node.currentQuantity}</Text>
        </Stack>
    );
  }

export const getServerSideProps: GetServerSideProps = async (context) => {
    let base_url = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_SHOP_URL : 'http://localhost:4200'

    console.log(context.params?.id)

    const result = await fetch(`${base_url}/api/get-order?orderId=${context.params?.id}`).then(res => res.json())

    return {
        props: {
            data: result.response.order
        }
    }
}