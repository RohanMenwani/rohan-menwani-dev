"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticlesFieldProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
}

export function ParticlesField({
  count = 2000,
  color = "#6366f1",
  size = 0.015,
  spread = 15,
}: ParticlesFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread;
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return arr;
  }, [count, spread]);

  const positionAttribute = useMemo(
    () => new THREE.BufferAttribute(positions, 3),
    [positions]
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.03 + mouse.x * 0.1;
    pointsRef.current.rotation.x = mouse.y * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <primitive object={positionAttribute} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
