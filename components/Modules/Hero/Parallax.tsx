"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export function Parallax({
  children,
  className,
  ...props
}: {
  children: any;
  className?: string;
  props?: any;
}) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={ref} className={className} {...props}>
      <motion.div
        style={{ y }}
        className="absolute left-0 top-0 z-0 h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
