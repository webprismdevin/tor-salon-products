"use client"

import { Box, Text, BoxProps } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { wrap } from "@popmotion/popcorn";
import { sanity } from "../lib/sanity";
import useSWR from "swr";

const MotionBox = motion<BoxProps>(Box);

const sanityFetcher = (query: string) => sanity.fetch(query);

const settingsQuery = `*[ _type == "settings" ][0]
{ 
    banner
}`;

export default function Banner() {
  const { data, error } = useSWR(settingsQuery, sanityFetcher);

  const [[page, direction], setPage] = useState([0, 0]);
  const index = wrap(0, data?.banner.length, page);

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
      {!data && <div style={{textAlign: "center"}}>...</div>}
      {error && <>...</>}
      {data && <AnimatePresence initial={true} custom={direction} mode="wait">
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
          <Text textAlign={"center"}>{data.banner[index]}</Text>
        </MotionBox>
      </AnimatePresence>}
    </MotionBox>
  );
}
