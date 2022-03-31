import { AspectRatio, Button, Container, Heading, Image, Stack, Text, Box, Code } from "@chakra-ui/react";
import NextLink from 'next/link'

export default function Custom404(){
    return <Container centerContent py={40} maxW="container.lg">
        <Stack direction={["column", "row"]} spacing={[8, 20]}>
            <AspectRatio boxSize={80} ratio={1/1} flexShrink={0}>
                <Image src="/images/404-girl.jpg" alt="404 girl" />
            </AspectRatio>
            <Stack spacing={6}>
                <Box>
                    <Heading>Well...this is embarrasing!</Heading>
                    <Text>We can&apos;t find what you&apos;re looking for!</Text>
                </Box >
                <Text maxW="350px">If this is your first time shopping with us, use code <Code>imlost</Code> for 10% off your order.</Text>
                <Stack direction={['column', 'row']}>
                    <Button onClick={() => window.Tawk_API.maximize()}>Chat with us</Button><NextLink href="/help" passHref><Button>FAQ</Button></NextLink>
                </Stack>
            </Stack>
            </Stack>
    </Container>
}