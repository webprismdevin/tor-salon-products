import {
  Box,
  Text,
  HStack,
  BoxProps,
  Image,
  ImageProps,
  TextProps,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { wrap } from "@popmotion/popcorn";
import { AnimatePresence, motion, useAnimation } from "framer-motion";

const MotionBox = motion<BoxProps>(Box);
const MotionText = motion<TextProps>(Text);

const Testimonials = () => {
  const controls = useAnimation();

  const testimonials = [
    "I stopped washing my hair, for almost a year, because I wanted to feel my natural hair. TOR's Medium/Thick line are the only products that actually leave my hair feeling truly natural.",
    "It's literally the only conditioner I've found that actually washes out. TOR's products work great on my beard as well!",
  ];

  const [[page, direction], setPage] = useState([0, 0]);

  const index = wrap(0, testimonials.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <MotionBox>
      <Text fontSize={36} textTransform="uppercase">
        Testimonials
      </Text>
      <AnimatePresence exitBeforeEnter>
        <MotionText
          fontSize={18}
          fontStyle={"italic"}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          key={page}
        >
          {testimonials[index]}
        </MotionText>
      </AnimatePresence>
      <HStack gap={4}>
        <Box cursor={"pointer"} onClick={() => paginate(-1)}>
          ←
        </Box>
        <Box cursor={"pointer"} onClick={() => paginate(1)}>
          →
        </Box>
      </HStack>
    </MotionBox>
  );
};

export default Testimonials;
