import { useContext, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  Link,
  useToast,
} from "@chakra-ui/react";
import { NextRouter, useRouter } from "next/router";
import NextLink from "next/link";
import Head from "next/head";
import AuthContext from "../lib/auth-context";

function returnToast(response: any) {
  if (
    response.response.customerCreate.customerUserErrors[0]?.code === "TAKEN"
  ) {
    return {
      title: "Email address already exists.",
      description: "An account with this email address already exists",
      status: "error",
      isClosable: true,
    };
  }
  if (
    response.response.customerCreate.customerUserErrors[0]?.code ===
    "CUSTOMER_DISABLED"
  ) {
    return {
      title: "We've sent you an activation email!",
      description:
        "Looks like you've ordered with us before! We've sent you an email to activate your account.",
      status: "success",
      isClosable: true,
    };
  }
  if (response.response.customerCreate.customer?.id !== null) {
    return {
      title: "Welcome!",
      description: "Your account was successfully created! You may now login.",
      status: "success",
      isClosable: true,
    };
  }
}

export default function Login() {
  const [signIn, toggleSignIn] = useState(true);
  const router = useRouter();

  return (
    <Box pt={40} pb={20}>
      <Head>
        <title>Login | TOR Salon Products</title>
        <meta
          name="description"
          content="Sign in to view past order information."
        />
      </Head>
      <Container maxW="container.lg">
        {signIn ? <SignIn router={router} /> : <SignUp />}
        <Stack direction={["column-reverse", "row"]} mt={4}>
          <Box minW={[0, "45%"]}></Box>
          <Link onClick={() => toggleSignIn(!signIn)}>
            <Text>{signIn ? "Sign up" : "Sign in"} instead?</Text>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}

function SignIn({ router }: { router: NextRouter }) {
  const [show, toggle] = useState(false);
  const [loginFailed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, handleEmail] = useState("");
  const [password, handlePassword] = useState("");
  const { user, setUser, setToken } = useContext(AuthContext);
  const toast = useToast();

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleAuth();
    }
  };

  async function handleAuth() {
    setFailed(false);

    const response = await fetch("/api/sign-in", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((res) => res.json());

    if (response.customerAccessToken) {
      setToken({
        ...response,
      });

      window.localStorage.setItem(
        `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`,
        JSON.stringify({ ...response })
      );

      router.push("/account");

      return;
    }

    if (response.customerUserErrors) {
      console.log(response);

      setFailed(true);
      toast({
        title: "Login failed",
        description: response.customerUserErrors[0].message,
        isClosable: true,
        status: "error",
      });

      return;
    }
  }

  return (
    <Stack direction={["column", "row"]}>
      <Box minW="45%">
        <Heading mb={2}>Log in to TOR</Heading>
        <Text>Sign in to view past order information.</Text>
      </Box>
      <Stack spacing={4} w="full">
        <Input
          isInvalid={loginFailed}
          placeholder="Enter your email"
          size="md"
          value={email}
          onChange={(e) => handleEmail(e.target.value)}
        />
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            isInvalid={loginFailed}
            placeholder={"Enter your password"}
            value={password}
            onChange={(e) => handlePassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => toggle(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button alignSelf={"flex-start"} onClick={handleAuth}>
          Sign In
        </Button>
        <NextLink href="/reset-password" passHref legacyBehavior>
          <Link>
            <Text>Forgot Password?</Text>
          </Link>
        </NextLink>
      </Stack>
    </Stack>
  );
}

function SignUp() {
  const [show, toggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, handleEmail] = useState("");
  const [name, handleName] = useState("");
  const [surname, handleSurname] = useState("");
  const [password, handlePassword] = useState("");
  const [ReEnterPassword, handleReEnterPassword] = useState("");
  const toast = useToast();

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleAuth();
    }
  };

  async function handleAuth() {
    const response = await fetch("/api/create-account", {
      method: "POST",
      body: JSON.stringify({
        firstName: name,
        lastName: surname,
        email: email,
        password: password,
      }),
    }).then((res) => res.json());

    console.log(response);

    const toastOpts: any = returnToast(response);

    toast(toastOpts);

    return;
  }

  function passwordCompare() {
    //returns false, i.e, input is valid
    if (password === ReEnterPassword) return false;
    //return true if the passwords do not equal each other, i.e., input is invalid
    return true;
  }

  return (
    <Stack direction={["column", "row"]}>
      <Box minW="45%">
        <Heading>Create your TOR account</Heading>
        <Text>
          View past orders, and receive an exclusive offer for signing up!
        </Text>
      </Box>
      <Stack spacing={4} w="full">
        <Stack direction="row">
          <Input
            placeholder="Enter your first name"
            size="md"
            value={name}
            onChange={(e) => handleName(e.target.value)}
          />
          <Input
            placeholder="Enter your last name"
            size="md"
            value={surname}
            onChange={(e) => handleSurname(e.target.value)}
          />
        </Stack>
        <Input
          placeholder="Enter your email"
          size="md"
          value={email}
          onChange={(e) => handleEmail(e.target.value)}
        />
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            isInvalid={passwordCompare()}
            placeholder={"Enter your password"}
            value={password}
            onChange={(e) => handlePassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => toggle(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            isInvalid={passwordCompare()}
            placeholder={"Re-enter your password"}
            value={ReEnterPassword}
            onChange={(e) => handleReEnterPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => toggle(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button alignSelf={"flex-start"} onClick={handleAuth}>
          Sign Up
        </Button>
      </Stack>
    </Stack>
  );
}
