import {
  Box,
  Container,
  Flex,
  Input,
  Stack,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";

export default function MailingList() {
  return (
    <Box py={20} w="full">
      <Container maxW="container.sm">
        <Stack spacing={6} textAlign="center">
          <Heading size="lg" >
            Sign Up For Updates!
          </Heading>
          <Text>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </Text>
          <Stack direction="row" maxW="full">
            <Input placeholder="Enter your email!" />
            <Button>Submit</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
