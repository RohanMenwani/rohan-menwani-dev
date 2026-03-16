"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import { SceneCanvas } from "@/components/3d";
import * as THREE from "three";
import type { Skill } from "@/data/constants";

interface SkillOrb {
  name: string;
  color: string;
  icon: string;
  position: [number, number, number];
}

function OrbMesh({
  orb,
  onSelect,
  isSelected,
}: {
  orb: SkillOrb;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = hovered || isSelected ? 1.3 : 1;
    const current = meshRef.current.scale.x;
    const next = current + (target - current) * 0.1;
    meshRef.current.scale.setScalar(next);
  });

  return (
    <Float speed={2} floatIntensity={0.5} rotationIntensity={0.3}>
      <mesh
        ref={meshRef}
        position={orb.position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onSelect}
      >
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={orb.color}
          roughness={0.2}
          metalness={0.8}
          emissive={orb.color}
          emissiveIntensity={hovered || isSelected ? 0.4 : 0.1}
        />
        {(hovered || isSelected) && (
          <Html center distanceFactor={8}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "white",
                background: "rgba(0,0,0,0.7)",
                padding: "2px 8px",
                borderRadius: 4,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {orb.name}
            </div>
          </Html>
        )}
      </mesh>
    </Float>
  );
}

interface OrbsSceneProps {
  skills: SkillOrb[];
  selectedSkill: string | null;
  onSelectSkill: (name: string) => void;
}

function OrbsScene({ skills, selectedSkill, onSelectSkill }: OrbsSceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#6366f1" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
      {skills.map((orb) => (
        <OrbMesh
          key={orb.name}
          orb={orb}
          isSelected={selectedSkill === orb.name}
          onSelect={() => onSelectSkill(orb.name)}
        />
      ))}
    </>
  );
}

function buildSkillOrbs(skills: Skill[]): SkillOrb[] {
  return skills.map((skill, i) => {
    const total = skills.length;
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = (col - cols / 2) * 1.2 + 0.6;
    const y = -(row - Math.floor(total / cols) / 2) * 1.0;
    return {
      name: skill.label,
      color: skill.color === "#fff" || skill.color === "#ffffff" ? "#a5b4fc" : skill.color,
      icon: skill.icon,
      position: [x, y, 0],
    };
  });
}

interface SkillsOrbsPanelProps {
  skills: Skill[];
  selectedSkill: string | null;
  onSelectSkill: (name: string) => void;
}

export function SkillsOrbsPanel({
  skills,
  selectedSkill,
  onSelectSkill,
}: SkillsOrbsPanelProps) {
  const orbs = buildSkillOrbs(skills);

  return (
    <div className="hidden lg:block w-full h-64 rounded-xl overflow-hidden border border-border bg-card/50">
      <SceneCanvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <OrbsScene
          skills={orbs}
          selectedSkill={selectedSkill}
          onSelectSkill={onSelectSkill}
        />
      </SceneCanvas>
    </div>
  );
}
