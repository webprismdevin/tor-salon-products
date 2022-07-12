import { Container, Heading, Button, Link, Box } from "@chakra-ui/react";
import Script from "next/script";

export default function Follow() {
  return (
    // <Container maxW="container.xl" pb={40} mt={20}>
      <Box w="full" pt={40}>
        {/* <Heading textAlign={"center"}>Follow us on Instagram!</Heading>
        <Box textAlign={"center"} my={6}>
          <Link
            href="https://www.instagram.com/tor_salonproducts/"
            target="_blank"
          >
            <Button>Follow</Button>
          </Link>
        </Box> */}
        <Script
          strategy="afterInteractive"
          id="EmbedSocialHashtagScript"
          src="https://embedsocial.com/cdn/ht.js"
        ></Script>
        <div
          className="embedsocial-hashtag"
          data-ref="e809ba879b57c02fc17f2171500c0a089e3ea49f"
        ></div>
      </Box>
    // </Container>
  );
}
