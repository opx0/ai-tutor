"use client";

import { motion, Variants } from "framer-motion";
import { FC, ReactNode } from "react";

interface MotionWrapperProps {
  children: ReactNode;
  variants: Variants;
  initial?: string;
  animate?: string;
  transition?: object;
  className?: string;
}

const MotionWrapper: FC<MotionWrapperProps> = ({
  children,
  variants,
  initial = "hidden",
  animate = "visible",
  transition,
  className,
}) => {
  return (
    <motion.div
      variants={variants}
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
