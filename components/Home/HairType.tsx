import {
  Heading,
  Box,
  BoxProps,
  Image,
  ImageProps,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";

const MotionBox = motion<BoxProps>(Box);
const MotionImage = motion<ImageProps>(Image);

const HairType = ({
  typeImage,
  title,
  photo,
  link,
}: {
  typeImage: string;
  title: string;
  photo: string;
  link: string;
}) => {
  return (
    <NextLink href={link} passHref>
      <MotionBox
        py={48}
        pos="relative"
        width={["full", "33.33%"]}
        display={"grid"}
        placeItems={"center"}
        initial="initial"
        whileHover="hover"
      >
        <MotionImage
          src={photo}
          objectFit={"fill"}
          pos="absolute"
          loading="lazy"
          zIndex={0}
          alt=""
          variants={{
            initial: {
              opacity: 0,
            },
            hover: {
              opacity: 1,
            },
          }}
        />
        <MotionImage
          src={typeImage}
          objectFit={"fill"}
          pos="absolute"
          loading="lazy"
          zIndex={-1}
          transform={"rotate(35deg)"}
          alt=""
          variants={{
            initial: {
              opacity: 0.25,
            },
            hover: {
              opacity: 0,
            },
          }}
        />
        <Heading>{title}</Heading>
      </MotionBox>
    </NextLink>
  );
};

export default HairType;