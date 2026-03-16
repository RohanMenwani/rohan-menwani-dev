"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

interface FloatingGeometryProps {
  position: [number, number, number];
  shape?: "icosahedron" | "torus" | "octahedron" | "sphere";
  color?: string;
  wireframe?: boolean;
  speed?: number;
  floatAmplitude?: number;
}

export function FloatingGeometry({
  position,
  shape = "icosahedron",
  color = "#6366f1",
  wireframe = false,
  speed = 0.5,
  floatAmplitude = 0.3,
}: FloatingGeometryProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = t * speed * 0.3;
    meshRef.current.rotation.y = t * speed * 0.5;
    meshRef.current.position.y =
      initialY + Math.sin(t * speed) * floatAmplitude;
  });

  const geometry = {
    icosahedron: <icosahedronGeometry args={[1, 1]} />,
    torus: <torusGeometry args={[0.8, 0.3, 16, 100]} />,
    octahedron: <octahedronGeometry args={[1, 0]} />,
    sphere: <sphereGeometry args={[0.8, 32, 32]} />,
  }[shape];

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <MeshWobbleMaterial
        color={color}
        wireframe={wireframe}
        factor={0.1}
        speed={1}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}
