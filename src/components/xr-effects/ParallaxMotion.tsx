import { ReactNode } from "react";

interface ParallaxMotionProps {
  children?: ReactNode;
  speed?: number;
  className?: string;
  depth?: number;
  blobColor?: string;
  fog?: boolean;
  shimmer?: boolean;
}

export const ParallaxMotion = ({ children, speed = 0.5, className }: ParallaxMotionProps) => {
  return <div className={className || "transition-transform duration-300"}>{children}</div>;
};
