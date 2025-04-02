"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gradientClassName?: string;
}

export const AnimatedGradientBorder = ({
  children,
  className,
  containerClassName,
  gradientClassName,
}: AnimatedGradientBorderProps) => {
  return (
    <div className={cn("relative rounded-xl p-[1px]", containerClassName)}>
      <motion.div
        className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500",
          gradientClassName
        )}
        style={{ opacity: 0.5 }}
        animate={{
          background: [
            "linear-gradient(to right, #3b82f6, #8b5cf6)",
            "linear-gradient(to right, #8b5cf6, #ec4899)",
            "linear-gradient(to right, #ec4899, #3b82f6)",
            "linear-gradient(to right, #3b82f6, #8b5cf6)",
          ],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <div
        className={cn(
          "relative rounded-xl bg-white p-6 dark:bg-slate-950",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
