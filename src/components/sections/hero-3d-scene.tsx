"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { FloatingGeometry } from "@/components/3d/floating-geometry";
import { ParticlesField } from "@/components/3d/particles-field";

function CameraRig() {
  const { camera, mouse } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function Hero3DScene() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#6366f1" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />

      <ParticlesField count={1500} color="#a5b4fc" size={0.012} spread={20} />

      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <FloatingGeometry
          position={[-3.5, 1.5, -2]}
          shape="icosahedron"
          color="#6366f1"
          wireframe
          speed={0.3}
        />
      </Float>

      <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
        <FloatingGeometry
          position={[3.8, -1, -1]}
          shape="torus"
          color="#8b5cf6"
          speed={0.4}
        />
      </Float>

      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <FloatingGeometry
          position={[0.5, 2.5, -3]}
          shape="octahedron"
          color="#c4b5fd"
          wireframe
          speed={0.6}
        />
      </Float>
    </>
  );
}
