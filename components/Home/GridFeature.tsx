import {
  Heading,
  Box,
  Text,
  BoxProps,
  AspectRatio,
  Image,
  ImageProps,
  GridItem,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import formatter from "../../lib/formatter";

const MotionBox = motion<BoxProps>(Box);
const MotionImage = motion<ImageProps>(Image);

const GridFeature = ({
  name,
  price,
  image,
  link,
}: {
  name: string;
  price: string;
  image: string;
  link?: string;
}) => {
  return (
    <GridItem colSpan={[3, 1]} overflow="hidden">
      <NextLink href={link ? link : ""} passHref>
        <MotionBox
          py={48}
          pos="relative"
          width={"100%"}
          initial="initial"
          whileHover="hover"
        >
          <AspectRatio
            minW={"100%"}
            minH={"100%"}
            ratio={1 / 1}
            pos="absolute"
            top={0}
            left={0}
            zIndex={-1}
          >
            <MotionImage
              src={image}
              loading="lazy"
              // objectFit={"cover"}
              minW={"100%"}
              minH={"100%"}
              alt=""
              variants={{
                initial: {
                  opacity: 0.25,
                },
                hover: {
                  opacity: 1,
                },
              }}
            />
          </AspectRatio>
          <MotionBox
            textAlign={"center"}
            variants={{ initial: { opacity: 1 }, hover: { opacity: 0 } }}
            mx="auto"
            display={"grid"}
            placeItems="center"
          >
            <Heading
              fontSize={["2xl", "lg", "lg", "2xl"]}
              maxW={[300, null, 200, 320]}
            >
              {name}
            </Heading>
            <Text fontSize={24}>{formatter.format(parseInt(price))}</Text>
          </MotionBox>
        </MotionBox>
      </NextLink>
    </GridItem>
  );
};

export default GridFeature;
