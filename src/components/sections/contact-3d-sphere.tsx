"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { SceneCanvas } from "@/components/3d";
import * as THREE from "three";

function AnimatedSphere() {
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!outerRef.current) return;
    const t = state.clock.getElapsedTime();
    outerRef.current.rotation.y = t * 0.2;
    outerRef.current.rotation.z = t * 0.1;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-5, 0, 0]} intensity={0.8} color="#6366f1" />

      {/* Outer wireframe shell */}
      <mesh ref={outerRef} scale={1.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Inner distorted sphere */}
      <Sphere args={[1, 64, 64]} scale={1.4}>
        <MeshDistortMaterial
          color="#7c3aed"
          roughness={0.1}
          metalness={0.9}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.7}
        />
      </Sphere>

      {/* Core glow */}
      <Sphere args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#c4b5fd"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </>
  );
}

export function ContactSphere() {
  return (
    <div className="w-full h-72 lg:h-96">
      <SceneCanvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <AnimatedSphere />
      </SceneCanvas>
    </div>
  );
}
