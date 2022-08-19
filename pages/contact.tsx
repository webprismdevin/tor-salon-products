import {
  Box,
  Text,
  Container,
  Heading,
  Input,
  Textarea,
  GridItem,
  Grid,
  Button,
} from "@chakra-ui/react";

const Contact = () => {
  return (
    <Box pos="relative">
      <Container
        maxW="container.lg"
        pos="relative"
        minH="600"
        alignItems="center"
        pt={60}
        pb={40}
      >
        <Grid
          templateRows={["repeat(6,0.25fr)","repeat(4, 0.5fr)"]}
          templateColumns={["repeat(1, 1fr)","repeat(6, 1fr)"]}
          gap={[3]}
          p={[10,20]}
        >
          <GridItem rowSpan={[1,4]} colSpan={[1, 2]}>
            <Heading size="2xl" mb={4}>
              Contact Us
            </Heading>
            <Text pr={[0, 10]}>
              Ready to take your e-commerce to the next level? Fill out the form
              over there 👉. Let&apos;s create something unlike anything your
              customers have seen before.
            </Text>
          </GridItem>
          <GridItem colSpan={[1, 2]}>
            <Input placeholder="First Name" w="full" />
          </GridItem>
          <GridItem colSpan={[1, 2]}>
            <Input placeholder="Last Name" w="full" />
          </GridItem>
          <GridItem colSpan={[1, 2]}>
            <Input placeholder="Email" w="full" />
          </GridItem>
          <GridItem colSpan={[1, 2]}>
            <Input placeholder="Phone" w="full" />
          </GridItem>
          <GridItem colSpan={[1,4]}>
            <Textarea placeholder="Your message..."></Textarea>
          </GridItem>
          <GridItem colSpan={1}>
            <Button
              w="full"
              _hover={{ color: "gray.800", bg: "white" }}
            >
              Submit
            </Button>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
