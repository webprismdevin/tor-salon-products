import {
  Box, Heading,
  List,
  ListItem,
  Stack,
  Text
} from "@chakra-ui/react";
import React from "react";

export default function HairTypes() {
  return (
    <Box px={[2, 8]}>
      <Heading as="h2" fontFamily={"Futura"} mb={6} textAlign={"center"}>
        Designed By Hair Type. Formulated For Results.
      </Heading>
      <Stack
        spacing={[2, 8]}
        direction={["column", null, "row"]}
        w="full"
        justify="center"
      >
        <Stack align="center" py={[8, 16]} flexGrow={1} bg="brand.curly">
          <Text fontSize={24} mb={3}>
            Curly
          </Text>
          <List>
            <ListItem>Balanced curls</ListItem>
            <ListItem>Increased definition</ListItem>
            <ListItem>Add bounce and shine</ListItem>
            <ListItem>Real moisture</ListItem>
            <ListItem>Breakage &amp; frizz protection</ListItem>
          </List>
        </Stack>
        <Stack align="center" py={[8, 16]} flexGrow={1} bg="brand.fineThin">
          <Text fontSize={24} mb={3}>
            Fine/Thin
          </Text>
          <List>
            <ListItem>Voluptous volume</ListItem>
            <ListItem>Soft touch</ListItem>
            <ListItem>Naturally detangling</ListItem>
            <ListItem>Add shine</ListItem>
            <ListItem>Fuller styling</ListItem>
          </List>
        </Stack>
        <Stack align="center" py={[8, 16]} flexGrow={1} bg="brand.mediumThick">
          <Text fontSize={24} mb={3}>
            Medium/Thick
          </Text>
          <List>
            <ListItem>Add shine</ListItem>
            <ListItem>Easily managed thick hair</ListItem>
            <ListItem>Real moisture</ListItem>
            <ListItem>No added weight</ListItem>
            <ListItem>Sexier second day hair</ListItem>
          </List>
        </Stack>
      </Stack>
    </Box>
  );
}