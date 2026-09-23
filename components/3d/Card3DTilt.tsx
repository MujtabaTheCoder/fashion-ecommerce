"use client";

import React, { useRef, useState } from "react";

type Card3DTiltProps = {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
};

export function Card3DTilt({
  children,
  className = "",
  maxTilt = 12,
  glareOpacity = 0.25,
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
    );

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setGlarePosition({
      x: glareX,
      y: glareY,
      opacity: glareOpacity,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: "transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {/* Dynamic 3D Glare Reflection Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.0) 65%)`,
        }}
      />
    </div>
  );
}
