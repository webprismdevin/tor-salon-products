import { AspectRatio, Box } from "@chakra-ui/react";
import NextImage from "next/image";
import { imageBuilder } from "../../lib/sanity";

export default function HeroImage({ content }: any) {
  return (
    <Box width={"100%"}  overflow={"hidden"}>
      <AspectRatio ratio={16 / 9} maxH={400}>
        <NextImage
          src={imageBuilder(content.image).height(400).url()}
          blurDataURL={imageBuilder(content.image).width(64).url()}
          layout="fill"
          objectFit="cover"
        />
      </AspectRatio>
    </Box>
  );
}
