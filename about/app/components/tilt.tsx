import React, { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Box } from "@mui/material";
import { useDetextTouchScreenOnly } from "../hooks/use-detect-touch-sceen-only";

type TiltProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

export const Tilt: React.FC<TiltProps> = ({ children, disabled = false }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isTouchScreen = useDetextTouchScreenOnly();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-150, 150], [20, -20]);
  const rotateY = useTransform(springX, [-150, 150], [-20, 20]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isTouchScreen) return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Box
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </Box>
  );
};
