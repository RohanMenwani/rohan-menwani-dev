"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense, ReactNode, useEffect, useState } from "react";

interface SceneCanvasProps {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number };
}

export function SceneCanvas({
  children,
  className = "",
  camera = { position: [0, 0, 5], fov: 75 },
}: SceneCanvasProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Canvas
      className={className}
      camera={camera}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        {children}
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
