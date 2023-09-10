import {
  Text,
  Heading,
  Flex,
  Box,
  Container,
  Input,
  Button,
  Stack,
  Link,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import Head from "next/head";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false)
  const toast = useToast()

  async function submitReset() {
    setFailure(false)

    const resp = await fetch(
      `/api/reset-password?email=${encodeURIComponent(email)}`
    ).then((res) => res.json());

    if (resp.response.customerRecover.customerUserErrors.length === 0) {
      setLoading(false);
      toast({
        title: "Check your email",
        description: "We've sent you an email to reset your password. Click the included link to finish resetting your password.",
        status: 'success',
        duration: 8000,
        isClosable: true
      })
    }
    else {
      setLoading(false)
      toast({
        title: "Something went wrong.",
        description: "Contact us for more details.",
        status: 'error',
        duration: 8000
      })
    }
  }

  return (
    <Container py={40}>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SHOP_NAME} | Reset Your Password</title>
      </Head>
      <Stack spacing={4} alignItems={"flex-start"}>
        <Heading>Reset Your Password</Heading>
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button isLoading={loading} onClick={submitReset}>
              Submit
            </Button>
      </Stack>
    </Container>
  );
}
