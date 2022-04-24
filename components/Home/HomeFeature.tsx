import {
  Heading,
  Box,
  Text,
  BoxProps,
  Image,
  ImageProps,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import formatter from "../../lib/formatter";

const MotionBox = motion<BoxProps>(Box);
const MotionImage = motion<ImageProps>(Image);

declare interface ProductFeatureTypes {
  name: string;
  price: string;
  image: string;
  link: string;
}

const ProductFeature = ({ name, price, image, link }: ProductFeatureTypes) => {
  return (
    <NextLink href={link} passHref>
      <MotionBox
        maxW={["none", 280]}
        textAlign="center"
        display={"grid"}
        placeItems={"center"}
        initial="initial"
        whileHover="hover"
        pos="relative"
        minH={[360, "auto"]}
      >
        <MotionImage
          src={image}
          loading="lazy"
          alt=""
          pos="absolute"
          zIndex={-1}
          variants={{
            initial: { opacity: 0.25 },
            hover: { opacity: 1 },
          }}
        />
        <MotionBox
          variants={{ initial: { opacity: 1 }, hover: { opacity: 0 } }}
        >
          <Heading
            fontSize={["2xl", "lg", null, null, "2xl"]}
            maxW={[300, "none"]}
          >
            {name}
          </Heading>
          <Text>{formatter.format(parseInt(price))}</Text>
        </MotionBox>
      </MotionBox>
    </NextLink>
  );
};

export default ProductFeature;