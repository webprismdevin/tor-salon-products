import {
  Heading,
  Box,
  BoxProps,
  Image,
  ImageProps,
  Text
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
        py={[20, 48]}
        pos="relative"
        width={["full", "33.33%"]}
        display={"grid"}
        placeItems={"center"}
        initial="initial"
        whileHover="hover"
      >
        <MotionImage
          src={photo}
          objectFit={["contain", "fill"]}
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
          objectFit={["contain", "fill"]}
          pos="absolute"
          maxH={["full", "auto"]}
          loading="lazy"
          zIndex={-1}
          transform={"rotate(35deg)"}
          alt=""
          variants={{
            initial: {
              opacity: 0.15,
            },
            hover: {
              opacity: 0,
            },
          }}
        />
        <Text px={2} fontSize={"2xl"} textAlign={"center"}>{title}</Text>
      </MotionBox>
    </NextLink>
  );
};

export default HairType;