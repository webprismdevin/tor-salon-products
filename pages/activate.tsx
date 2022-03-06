import { Container, Flex, Box, Input, Text, Heading, InputGroup, InputRightElement, Button, Stack, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Activate({activationUrl}:{ activationUrl: string}) {
    const [show, toggle] = useState(false)
    const [password, handlePassword] = useState("")
    const [password2, handlePassword2] = useState("")
    const toast = useToast()
    const router = useRouter()

    async function SendActivationRequest(){
        if(password === password2){
            const response = await fetch("/api/activate-customer", {
                method: 'POST',
                body: JSON.stringify({
                    activationUrl: activationUrl,
                    password: password
                })
            }).then(res => res.json())

            if(response.data.customerActivateByUrl.customer === null){
                toast({
                    title: response.data.customerActivateByUrl.customerUserErrors[0]?.message,
                    description: "If the issue persists, or you need help, contact us.",
                    status: 'error',
                    isClosable: true
                })
            } else {
                toast({
                    title: "Your account has been activated!",
                    description: "You can now access your account. Close this prompt to login.",
                    status: 'success',
                    isClosable: true,
                    onCloseComplete: () => router.push('/login')
                })
            }

        } else {
            toast({
                title: "Your passwords don't match!",
                description: "Check your password entries and try again",
                status: 'error',
                isClosable: true
            })
        }
    }

    return (
        <Container py={20} maxW="container.lg">
        <Flex direction={['column', 'row']}>
            <Box minW={'40%'}>
            <Heading>Activate Your Account</Heading>
            <Text>Create a password to activate your account.</Text>
            </Box>
            <Stack spacing={4} w="full">
            <InputGroup size="md">
                <Input
                pr="4.5rem"
                type={show ? 'text' : 'password'}
                placeholder={'Create your new password'}
                value={password}
                onChange={(e) => handlePassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => toggle(!show)}>
                    {show ? 'Hide' : 'Show'}
                </Button>
                </InputRightElement>
            </InputGroup>
            <InputGroup size="md">
                <Input
                pr="4.5rem"
                type={show ? 'text' : 'password'}
                placeholder={'Re-enter your new password'}
                value={password2}
                onChange={(e) => handlePassword2(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => toggle(!show)}>
                    {show ? 'Hide' : 'Show'}
                </Button>
                </InputRightElement>
            </InputGroup>
            <Button alignSelf={"flex-start"} onClick={SendActivationRequest}>Create Account</Button>
            </Stack>
        </Flex>
        </Container>
    );
}

export async function getServerSideProps(context: any){
    console.log(context.query.activationUrl)

    return {
        props:{
            activationUrl: context.query.activationUrl,
        }
    }
}