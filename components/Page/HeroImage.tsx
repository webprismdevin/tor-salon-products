import { AspectRatio } from "@chakra-ui/react";
import NextImage from "next/image";
import { imageBuilder } from "../../lib/sanity";

export default function HeroImage({ content }: any) {
  return (
    <AspectRatio ratio={16 / 9} width={"100%"}>
      <NextImage
        src={imageBuilder(content.image).width(1600).url()}
        blurDataURL={imageBuilder(content.image).width(64).url()}
        layout="fill"
        objectFit="cover"
      />
    </AspectRatio>
  );
}
