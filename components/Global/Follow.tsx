import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Script from "next/script";

export default function Follow() {
  const router = useRouter()

  return (
      <Box w="full" pt={0} display={router.asPath.includes("/offer") ? "none" : "inherit"}>
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
  );
}
