import { Box, Text, BoxProps } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { wrap } from "@popmotion/popcorn";
import Link from "next/link";
import { NavArrowLeft, NavArrowRight } from "components/Page/Slides";

const MotionBox = motion<BoxProps>(Box);

declare interface BannerSettings {
  data: [any];
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
    }, 3200);

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
          {data[index].to ? (
            <Link href={data[index].to}>
              <p className="text-center">{data[index].text}</p>
            </Link>
          ) : (
            <p className="text-center">{data[index].text}</p>
          )}
        </MotionBox>
      </AnimatePresence>
      {/* <NavArrowRight onClick={() => paginate(1)} className="opacity-50 cursor-pointer" /> */}
    </motion.div>
  );
}
