import { Box, Text, BoxProps } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { wrap } from "@popmotion/popcorn";
import useSWR from "swr";
import { sanity } from "../../lib/sanity";

const MotionBox = motion<BoxProps>(Box);
const groqFetcher = (query:any) => sanity.fetch(query, {});

declare interface BannerSettings {
  data: []
}

export default function Banner({ data }: BannerSettings) {
  // const { data, error } = useSWR(`*[_type == "siteSettings"][0]`, groqFetcher, { refreshInterval: 60 } )

  const [[page, direction], setPage] = useState([0, 0]);
  const index = wrap(0, data.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 2900);

    return () => clearInterval(interval);
  }, [page]);

  return (
    <MotionBox py={2} bg="black" color="white">
      <AnimatePresence initial={true} custom={direction} mode='wait'>
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
          <Text textAlign={"center"}>{data[index]}</Text>
        </MotionBox>
      </AnimatePresence>
    </MotionBox>
  );
}
