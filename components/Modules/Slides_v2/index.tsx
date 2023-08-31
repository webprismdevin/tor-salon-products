"use client";

import { wrap } from "@popmotion/popcorn";
import { AnimatePresence, useCycle, motion } from "framer-motion";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { SlideProps } from "../Slides";
import { Pagination } from "./Pagination";
import Slide from "./Slide";

export type SlidesProps = {
  data: {
    slides: SlideProps[];
  };
};

export default function Slides({ data }: SlidesProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const index = wrap(0, data.slides.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ x: -1000 * direction, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 1000 * direction, opacity: 0 }}
          transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
          custom={direction}
          key={page}
        >
          <Slide slide={data.slides[index]} />
        </motion.div>
      </AnimatePresence>
      <Pagination length={data.slides.length} index={index} setPage={setPage} />
    </div>
  );
}
