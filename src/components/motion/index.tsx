"use client";
import { cn } from "@/lib/utils";

import { useEffect } from "react";
import {
  MotionValue,
  type HTMLMotionProps,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";

export function FadeInGrow({ className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{
        opacity: 1,
        height: 0,
      }}
      animate={{
        opacity: [0, 0, 1],
        height: "auto",
      }}
      exit={{
        opacity: 0,
        height: 0,
        transition: {
          opacity: { duration: 0.2, delay: 0 },
          height: { duration: 0.2, delay: 0.1 },
        },
      }}
      className={className}
      {...props}
    />
  );
}

export function SpringBounce({ className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className={cn(
        "absolute inset-0 bg-[#aec3ca52] dark:bg-zinc-800 z-10 rounded-sm",
        className
      )}
      {...props}
    />
  );
}

export function FadeIn({ className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={className}
      {...props}
    />
  );
}

interface AnimatedNumberProps {
  value: number;
  mass?: number;
  stiffness?: number;
  damping?: number;
  precision?: number;
  format?: (value: number) => string;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  className?: string;
}

export function AnimatedNumber({
  value,
  mass = 0.8,
  stiffness = 75,
  damping = 15,
  precision = 2,
  format = (value) => formatCurrency(value * 100),
  onAnimationStart,
  onAnimationComplete,
  className,
}: AnimatedNumberProps) {
  const spring = useSpring(value, { mass, stiffness, damping });
  const display: MotionValue<string> = useTransform(spring, (current) =>
    format(parseFloat(current.toFixed(precision)))
  );

  useEffect(() => {
    spring.set(value);
    if (onAnimationStart) onAnimationStart();
    const unsubscribe = spring.onChange(() => {
      if (spring.get() === value && onAnimationComplete) onAnimationComplete();
    });
    return () => unsubscribe();
  }, [spring, value, onAnimationStart, onAnimationComplete]);

  return <motion.span className={cn(className)}>{display}</motion.span>;
}

function formatCurrency(currencyInCents: number | null | undefined): string {
  if (!currencyInCents) return `$ 0.00`;
  if (currencyInCents <= 0) return `$ 0.00`;

  const currencyStringified = Math.round(currencyInCents).toString();
  const cents = currencyStringified.slice(-2);
  const reais = currencyStringified.slice(0, currencyStringified.length - 2);

  return `$ ${formatDollar()}.${cents}`;

  function formatDollar(): string {
    return reais.length > 0 ? numberWithCommas(reais) : "0";
  }

  function numberWithCommas(x: string) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
