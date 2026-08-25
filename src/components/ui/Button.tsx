"use client";

import { forwardRef, type ReactNode } from "react";
import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary: "bg-foreground text-background opacity-95 hover:opacity-100",
  secondary: "bg-surface-wash text-foreground border border-border-strong hover:bg-surface-wash-strong",
  ghost: "text-foreground hover:bg-surface-wash",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-12 px-6 text-sm gap-2",
  lg: "h-14 px-8 text-base gap-2.5",
};

function buttonClassName(variant: Variant, size: Size, className?: string) {
  return cn(
    "relative inline-flex items-center justify-center rounded-full font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-40",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

const hoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.035 },
};

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.96 }}
        variants={hoverVariants}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={buttonClassName(variant, size, className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant = "primary", size = "md", className, children }: ButtonLinkProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      variants={hoverVariants}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="inline-block"
    >
      <Link href={href} className={buttonClassName(variant, size, className)}>
        {children}
      </Link>
    </motion.div>
  );
}
