import { AspectRatio, Box } from "@chakra-ui/react";
import { useNextSanityImage } from "next-sanity-image";
import NextImage from "next/image";
import { imageBuilder, sanity } from "../../lib/sanity";

export default function HeroImage({ content }: any) {
  const imageProps = useNextSanityImage(
    sanity,
    content.image
  );
    
  return (
    <Box width={"100%"} position="relative">
        <NextImage
          //@ts-ignore
          {...imageProps}
          layout="responsive"
          sizes="(max-width: 800px) 100vw, 800px"
        />
    </Box>
  );
}
