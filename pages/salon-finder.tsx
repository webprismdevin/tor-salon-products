import {
  Container,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Link,
  Divider,
  Input,
  Flex,
  Icon,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { groq } from "next-sanity";
import { useState } from "react";
import { getClient, imageBuilder } from "../lib/sanity";
import Search from "@smakss/search";
import { FiDelete, FiGlobe } from "react-icons/fi";
import Head from "next/head";

declare interface SalonPageData {
  salons: any;
}

export default function SalonFinder({ salons }: SalonPageData) {
  const [search, setSearch] = useState("");

  return (
    <Container py={20} maxW="container.lg">
      <Head>
        <title>Salon Finder | TOR Salon Products</title>
        <meta name="description" content="Search our directory of salon locations to purchase TOR products, or find a stylist that uses our product lines." />
      </Head>
      <Stack spacing={6} align="center" w="full">
        <Heading size="lg">Salon Finder</Heading>
        <Heading size="2xl">Find TOR Products</Heading>
        <Divider />
        <InputGroup maxW="560px">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a salon by name, city, state, etc..."
          />
          <InputRightElement>
            {search !== "" && <Icon as={FiDelete} size={12} onClick={() => setSearch("")} />}
          </InputRightElement>
        </InputGroup>
        <SimpleGrid templateColumns={"repeat(3, 1fr)"} w="full" gap={4}>
          {Search({ searchText: search, searchItems: salons }).map((s: any) => (
            <GridItem
              key={s._id}
              colSpan={[3, 1]}
              shadow="sm"
              p={6}
              outline={"1px solid rgba(0, 0, 0, 0.02)"}
            >
              <Stack spacing={2}>
                <Text fontSize={"xl"} fontWeight={400} fontFamily="Futura">
                  {s.name}
                </Text>
                <Link
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    s.name +
                      " " +
                      s.street +
                      " " +
                      s.city +
                      ", " +
                      s.state +
                      ", " +
                      s.zip
                  )}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                >
                  <Text>
                    {s.street} {s.city}
                  </Text>
                  <Text>
                    {s.state}, {s.zip}
                  </Text>
                </Link>
                <Link href={`tel:${s.phone}`}>{s.phone}</Link>
                <Flex flexDir={"row"}>
                  {s.website && (
                    <Link
                      href={s.website}
                      target="_blank"
                      referrerPolicy="no-referrer"
                    >
                      <Icon as={FiGlobe} size={12} />
                    </Link>
                  )}
                </Flex>
              </Stack>
            </GridItem>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

export const getStaticProps = async () => {
  const salonQuery = groq`*[_type == "salon"]`;

  const salons = await getClient(false).fetch(salonQuery, {});

  return {
    props: {
      salons,
    },
    revalidate: 60,
  };
};
