import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  useToast,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function NewPassword({ reset_url }: { reset_url: string}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, toggleShow1] = useState(false);
  const [show2, toggleShow2] = useState(false);

  const router = useRouter();
  const toast = useToast();

  async function setNewPassword() {
    const resp = await fetch("/api/set-new-password", {
      method: "POST",
      body: JSON.stringify({
        resetUrl: reset_url,
        new_password: password,
      }),
    }).then((res) => res.json());

    console.log(resp)

    if (resp.response.customerResetByUrl.customerAccessToken.accessToken) {
      console.log("fired")
      window.localStorage.setItem(
        `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`,
        JSON.stringify({ ...resp.response.customerResetByUrl.customerAccessToken })
      );

      router.push("/account");

      return;
    } 
    
    if (resp.response.customerResetByUrl.customerUserErrors.length > 0) {
      toast({
        title: "Something went wrong.",
        description:
          "We were unable to set your new password. Contact us to regain access to your account.",
        duration: 8000,
        status: "error",
        isClosable: true,
      });
    }
  }

  return (
    <Container py={40}>
        <Head>
            <title>Set Your New Passwords | TOR Salon Products</title>
        </Head>
      <Stack alignItems={"flex-start"}>
        <Heading size="lg">Reset Your Password</Heading>
        <InputGroup size="md">
          <Input
            value={password}
            type={show1 ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => toggleShow1(!show1)}>
              {show1 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <InputGroup size="md">
          <Input
            isInvalid={confirm !== password}
            value={confirm}
            type={show2 ? "text" : "password"}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => toggleShow2(!show2)}>
              {show2 ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button onClick={setNewPassword}>Update Password</Button>
      </Stack>
    </Container>
  );
}

export async function getServerSideProps({ query }: any) {
  return {
    props: {
      reset_url: query.url,
    },
  };
}
