import {
  Box,
  BoxProps,
  Text,
  AspectRatio,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import { motion } from "framer-motion";

const MotionBox = motion<BoxProps>(Box);

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
        <MotionBox
          variants={{
            initial: {
              opacity: 0,
            },
            hover: {
              opacity: 1,
            },
          }}
          pos="absolute"
          zIndex={0}
          h={"full"}
          w={"full"}
        >
          <AspectRatio ratio={1 / 1} h={"full"} w={"full"}>
            <NextImage
              src={photo}
              objectFit={"cover"}
              layout={"fill"}
              alt={`${title}`}
              sizes={"33vw"}
            />
          </AspectRatio>
        </MotionBox>
        <MotionBox
          zIndex={-1}
          transform={"rotate(35deg)"}
          maxH={["full", "auto"]}
          pos="absolute"
          boxSize={"75%"}
          variants={{
            initial: {
              opacity: 0.15,
            },
            hover: {
              opacity: 0,
            },
          }}
        >
          <NextImage
            src={typeImage}
            objectFit={"cover"}
            layout={"fill"}
            loading="lazy"
            alt=""
            sizes={"33vw"}
          />
        </MotionBox>
        <Text px={2} fontSize={["2xl", "4xl"]} textAlign={"center"}>
          {title}
        </Text>
      </MotionBox>
    </NextLink>
  );
};

export default HairType;
