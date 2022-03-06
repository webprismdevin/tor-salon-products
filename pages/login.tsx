import { useContext, useState } from "react"
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
  useToast
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import NextLink from 'next/link'
import Head from "next/head"
import ShopContext from "../lib/shop-context"

function returnToast(response: any){

    if(response.response.customerCreate.customerUserErrors[0]?.code === "TAKEN"){
      return {title: "Email address already exists.", description: "An account with this email address already exists", status: 'error', isClosable: true}
    }
    if(response.response.customerCreate.customerUserErrors[0]?.code === "CUSTOMER_DISABLED"){
      return {title: "We've sent you an activation email!", description: "Looks like you've ordered with us before! We've sent you an email to activate your account.", status: 'success', isClosable: true}
    }
    if(response.response.customerCreate.customer?.id !== null){
      return {title: "Welcome!", description: "Your account was successfully created! You may now login.", status: 'success', isClosable: true}
    }

}

export default function Login() {
  const [show, toggle] = useState(false)
  const [signIn, toggleSignIn] = useState(true)
  const [email, handleEmail] = useState("")
  const [password, handlePassword] = useState("")
  const [loginFailed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toast = useToast()
  const { shop } = useContext(ShopContext)

  async function handleAuth() {
    setFailed(false)

    if(!signIn){
        const response = await fetch('/api/create-account', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(res => res.json())

        console.log(response)
  
        const toastOpts:any = returnToast(response);

        toast(toastOpts)

        return
    }

    const response = await fetch('/api/sign-in', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        })
    }).then(res => res.json()) 

    if(response.customerAccessToken){
        console.log(response)
        window.localStorage.setItem(`${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:accessToken`, JSON.stringify({...response}))

        router.push('/account')

        return
    }

    if(response.customerUserErrors){
        console.log(response);
        setFailed(true);

        return
    }
  }

  return (
    <Box pt={40} pb={20}>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SHOP_NAME} | Account Login</title>
      </Head>
      <Container maxW="container.lg">
        <Stack direction={["column", "row"]} minH={250}>
          <Box minW="40%">
            <Heading>{signIn ? `Log In to ${shop.name}` : `Create Your ${shop.name} Account`}</Heading>
            <Text>See some cool stuff. Maybe.</Text>
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
                placeholder={
                  signIn ? "Enter your password" : "Enter a password"
                }
                value={password}
                onChange={(e) => handlePassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => toggle(!show)}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button alignSelf={"flex-start"} onClick={handleAuth}>Sign {signIn ? "In" : "Up"}</Button>
            <Link onClick={() => toggleSignIn(!signIn)}>
              <Text>{signIn ? "Sign up" : "Sign in"} instead?</Text>
            </Link>
            <NextLink href='/reset-password' passHref>
              <Link>
                <Text>Forgot Password?</Text>
              </Link>
            </NextLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}