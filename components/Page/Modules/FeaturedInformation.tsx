import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import React from "react";

export interface FeaturedInformationProps {
  module: ModuleProps;
}

export interface ModuleProps {
  format: "boxAndLines";
  title: string;
  body: string;
  features: [];
}

export default function FeaturedInformation({
  module,
}: FeaturedInformationProps) {

  switch (module.format) {
    case "boxAndLines":
      return <BoxAndLines module={module} />;
    default:
      return null;
  }
}

export function BoxAndLines({ module }: { module: ModuleProps }) {
  return (
    <Container maxW="container.lg" py={20}>
      <Stack direction={["column-reverse", null, null, "row"]} spacing={[8, 0]} align="stretch">
        <Stack spacing={4} justify="center" maxW={["100%", null, "50%"]} p={[8, null, 20]} bg="brand.fineThin">
          <Heading size="xl" fontFamily={"Futura"}>{module.title}</Heading>
          <Text>{module.body}</Text>
        </Stack>
        <Stack w="full" alignSelf={"center"}>
          {module.features.map((feature: { _key: string; text: string }, index: number) => (
            <Text py={4} borderBottom={index < module.features.length - 1 ? "1px solid" : ""} borderColor={"brand.fineThin"} textAlign={"right"} key={feature._key}>{feature.text}</Text>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
