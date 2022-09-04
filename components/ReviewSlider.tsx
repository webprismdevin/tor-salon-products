import { Box, Container, Stack, Text } from "@chakra-ui/react";
import { wrap } from "@popmotion/popcorn";
import { AnimatePresence, motion } from "framer-motion";
import { RatingStar } from "rating-star";
import { useEffect, useState } from "react";

export interface ReviewSliderProps {
  reviews: [{
    review: string
    rating: number
    _id: number
    name: string
  }];
}

const MotionBox = motion(Box);

export default function ReviewSlider({ reviews }: ReviewSliderProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const index = wrap(0, reviews.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 3200);

    return () => clearInterval(interval);
  }, [page]);

  return (
    <AnimatePresence initial={true} custom={direction} exitBeforeEnter={true}>
      <MotionBox
        custom={direction}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: { duration: 0.2 },
        }}
        exit={{
          opacity: 0,
        }}
        key={page}
      >
        <Container maxW="container.lg" minH={280} pt={20} display={"grid"} placeItems="center">
            <Stack w="full" spacing={3} align="center">
              <RatingStar size={32} id={reviews[index]._id?.toString()} rating={reviews[index].rating} colors={{ mask: "#000000", stroke: "#000000" }} />
              <Text fontSize={24} textAlign={"center"} dangerouslySetInnerHTML={{
                  __html: reviews[index].review
              }}/>
              <Text fontSize={20} fontStyle={"italic"} color={"blackAlpha.700"} textTransform={"capitalize"}>{reviews[index].name}</Text>
            </Stack>
        </Container>
      </MotionBox>
    </AnimatePresence>
  );
}
