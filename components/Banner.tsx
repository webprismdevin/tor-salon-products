"use client";
import { Box, Text, BoxProps } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { wrap } from "@popmotion/popcorn";

const MotionBox = motion<BoxProps>(Box);

declare interface BannerSettings {
  data: [
    {
      text: string;
    }
  ];
}

export default function Banner({ data }: BannerSettings) {
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
    <motion.div className="flex justify-center py-2 bg-black text-white">
      {/* <NavArrowLeft onClick={() => paginate(-1)} className="opacity-50 cursor-pointer" /> */}
      <AnimatePresence initial={true} custom={direction} mode="wait">
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
          <Text textAlign={"center"}>{data[index].text}</Text>
        </MotionBox>
      </AnimatePresence>
    </motion.div>
  );
}
