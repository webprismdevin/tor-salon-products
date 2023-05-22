import { AnimatePresence, motion } from "framer-motion";
import { wrap } from "@popmotion/popcorn";
import { useState } from "react";
import { imageBuilder } from "lib/sanity";
import Image from "next/image";
import Link from "next/link";

export interface Slide {
  id: string;
  image: any;
  image2?: any;
  title: string;
  caption: string;
  cta: {
    text: string;
    to: string;
  };
}

export default function Slides({ data }: { data: any }) {
  const { slides }: { slides: Slide[] } = data;

  const [[page, direction], setPage] = useState([0, 0]);
  const index = wrap(0, slides.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  // return <div>Send data</div>;

  return (
    <motion.div
      className="relative h-screen max-h-[700px] w-screen"
      custom={direction}
      key={page}
    >
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ x: -1000 * direction, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 1000 * direction, opacity: 0 }}
          transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
          custom={direction}
          key={page}
          className={`relative grid h-full w-full grid-cols-1 bg-white ${
            slides[index].image2 ? "lg:grid-cols-2" : ""
          }`}
        >
          <div className="absolute z-10 grid h-full w-full place-items-center px-12">
            <div className="text-center">
              <p className="text-shadow mb-4">{slides[index].caption}</p>
              <h2 className="text-shadow mb-6 max-w-xl text-center font-heading text-4xl uppercase md:text-5xl lg:text-6xl">
                {slides[index].title}
              </h2>
              {slides[index].cta?.to ? (
                <Link href={slides[index].cta.to}>
                  {slides[index].cta.text}
                </Link>
              ) : null}
            </div>
          </div>
          <div
            className={`h-full min-w-full max-w-full overflow-hidden ${
              slides[index].image2 ? "lg:max-w-1/2" : ""
            }`}
          >
            <Image
              src={imageBuilder(slides[index].image)
                .width(1200)
                .height(1200)
                .format("webp")
                .quality(80)
                .url()}
              fill
              sizes={slides[index].image2 ? "50vw" : "100vw"}
              className={`min-h-full min-w-full object-cover ${
                slides[index].image2 ? "" : "lg:min-w-full"
              }`}
              alt={slides[index].image?.alt}
            />
          </div>
          {slides[index].image2 && (
            <div className="max-w-1/2 hidden h-full overflow-hidden lg:block">
              <Image
                src={imageBuilder(slides[index].image2)
                  .width(1200)
                  .height(1200)
                  .format("webp")
                  .quality(80)
                  .url()}
                fill
                sizes={"50vw"}
                height={slides[index].image2.height}
                width={slides[index].image2.width}
                className="min-h-full object-cover"
                alt={slides[index].image2?.alt}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {/* back arrow */}
      <NavArrowLeft
        className="absolute left-5 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer"
        aria-label="previous"
        onClick={() => paginate(-1)}
      />
      {/* next arrow */}
      <NavArrowRight
        className="absolute right-5 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer"
        aria-label="next"
        onClick={() => paginate(1)}
      />
    </motion.div>
  );
}

export const NavArrowLeft = ({
  color,
  size,
  className,
  onClick,
  ...props
}: {
  color?: string;
  size?: number;
  className?: string;
  onClick: () => void;
  props?: any;
}) => {
  return (
    <svg
      {...props}
      width={size ? size : 24}
      height={size ? size : 24}
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color !== undefined ? color : "#ffffff"}
    >
      <path
        d="M15 6l-6 6 6 6"
        stroke={color !== undefined ? color : "#ffffff"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};

export const NavArrowRight = ({
  color,
  size,
  className,
  onClick,
  ...props
}: {
  color?: string;
  size?: number;
  className?: string;
  onClick: () => void;
  props?: any;
}) => {
  return (
    <svg
      {...props}
      width={size ? size : 24}
      height={size ? size : 24}
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color !== undefined ? color : "#ffffff"}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke={color !== undefined ? color : "#ffffff"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
};
