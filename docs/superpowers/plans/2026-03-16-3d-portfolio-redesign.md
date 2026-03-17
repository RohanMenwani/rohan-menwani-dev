# 3D Portfolio Complete Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform an existing Next.js 3D portfolio into a stunning, fully-interactive showcase for a software developer — with React Three Fiber scenes, per-section 3D interactions, polished animations, and zero breaking bugs.

**Architecture:** Each portfolio section gets its own self-contained 3D/interactive layer using React Three Fiber (R3F) + Drei helpers alongside the existing Spline keyboard asset. Bug fixes are applied first, then new sections replace or augment existing ones one at a time. Global polish (cursor, transitions, scroll) lands last.

**Tech Stack:** Next.js 14 · React 18 · TypeScript · React Three Fiber · Drei · Three.js · GSAP + ScrollTrigger · Framer Motion · Lenis smooth scroll · Tailwind CSS · Spline · Socket.io · Resend

---

## Chunk 1: Bug Fixes & R3F Foundation

### Task 1: Fix SocketContext Type Mismatch (Critical Bug)

**Files:**
- Modify: `src/contexts/socketio.tsx`
- Modify: `src/components/realtime/remote-cursors.tsx`

**Problem:** `SocketContext` types `users` as `User[]` (array) but `remote-cursors.tsx:53` calls `_users.values()` as if it's a `Map<string, User>`. This throws a runtime error.

- [ ] **Step 1: Read both files**

```bash
# Read the files to confirm exact lines
```

File: `src/contexts/socketio.tsx` — find the `users` state definition and its type.
File: `src/components/realtime/remote-cursors.tsx` — find line ~53 with `.values()` call.

- [ ] **Step 2: Fix remote-cursors.tsx — remove invalid .values() call**

In `src/components/realtime/remote-cursors.tsx`, change:
```ts
// BEFORE (broken)
const users = Array.from(_users.values());

// AFTER (fixed — _users is already User[])
const users = _users;
```

- [ ] **Step 3: Fix missing useEffect dependency**

In `src/components/realtime/remote-cursors.tsx`, find the `useEffect` that is missing `setUsers` in its dependency array and add it:
```ts
// BEFORE
useEffect(() => {
  // ...uses setUsers
}, [socket]); // missing setUsers

// AFTER
useEffect(() => {
  // ...uses setUsers
}, [socket, setUsers]);
```

- [ ] **Step 4: Remove unused isCurrentUser state**

In `src/contexts/socketio.tsx`, remove:
```ts
// DELETE these lines
const [isCurrentUser, setIsCurrentUser] = useState(false);
```
And remove `isCurrentUser` from the context value object if present.

- [ ] **Step 5: Verify no TypeScript errors**

```bash
cd "C:/Users/sdvad/OneDrive/Desktop/projects/3d-portfolio" && npx tsc --noEmit 2>&1 | head -40
```

Expected: zero errors in the realtime files.

- [ ] **Step 6: Commit**

```bash
git add src/contexts/socketio.tsx src/components/realtime/remote-cursors.tsx
git commit -m "fix: resolve SocketContext User[] vs Map type mismatch and stale closure"
```

---

### Task 2: Install R3F Dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install React Three Fiber and Drei**

```bash
cd "C:/Users/sdvad/OneDrive/Desktop/projects/3d-portfolio" && npm install @react-three/fiber@^8 @react-three/drei@^9 @react-three/postprocessing@^2
```

Expected output: packages added, no peer-dep errors (Three.js 0.167 is already installed).

- [ ] **Step 2: Verify install**

```bash
node -e "require('@react-three/fiber'); console.log('R3F OK')"
```

Expected: `R3F OK`

- [ ] **Step 3: Add R3F types to tsconfig if needed**

In `tsconfig.json`, confirm `"moduleResolution": "bundler"` or `"node16"` is set. R3F needs JSX handling — Next.js already handles this.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add @react-three/fiber, drei, postprocessing"
```

---

### Task 3: Create Shared 3D Base Components

**Files:**
- Create: `src/components/3d/scene-canvas.tsx` — reusable R3F Canvas wrapper
- Create: `src/components/3d/floating-geometry.tsx` — animated geometric meshes
- Create: `src/components/3d/particles-field.tsx` — GPU particle field
- Create: `src/components/3d/index.ts` — barrel export

- [ ] **Step 1: Create scene-canvas.tsx**

```tsx
// src/components/3d/scene-canvas.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense, ReactNode } from "react";

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
```

- [ ] **Step 2: Create floating-geometry.tsx**

```tsx
// src/components/3d/floating-geometry.tsx
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
```

- [ ] **Step 3: Create particles-field.tsx (R3F GPU version)**

```tsx
// src/components/3d/particles-field.tsx
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

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.03 + mouse.x * 0.1;
    pointsRef.current.rotation.x = mouse.y * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
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
```

- [ ] **Step 4: Create barrel export**

```ts
// src/components/3d/index.ts
export { SceneCanvas } from "./scene-canvas";
export { FloatingGeometry } from "./floating-geometry";
export { ParticlesField } from "./particles-field";
```

- [ ] **Step 5: Commit**

```bash
git add src/components/3d/
git commit -m "feat: add shared R3F base components (canvas, geometry, particles)"
```

---

## Chunk 2: Hero Section — 3D Command Center

### Task 4: Build 3D Hero Background Scene

**Files:**
- Create: `src/components/sections/hero-3d-scene.tsx` — R3F scene for hero
- Modify: `src/components/sections/hero.tsx` — integrate 3D scene

**Design:** Full-screen R3F canvas behind hero text. Contains:
- Particle field (stars)
- 3 floating geometric shapes (icosahedron, torus, octahedron) at different depths
- Subtle ambient + directional lights
- Mouse parallax on geometry

- [ ] **Step 1: Create hero-3d-scene.tsx**

```tsx
// src/components/sections/hero-3d-scene.tsx
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { FloatingGeometry } from "@/components/3d/floating-geometry";
import { ParticlesField } from "@/components/3d/particles-field";
import * as THREE from "three";

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
```

- [ ] **Step 2: Read current hero.tsx**

Read `src/components/sections/hero.tsx` fully to understand the existing layout before modifying.

- [ ] **Step 3: Integrate 3D scene into hero.tsx**

Add the `SceneCanvas` with `Hero3DScene` as an absolutely-positioned full-section background layer. Keep all existing text, buttons, and social links intact:

```tsx
// Add at the top of the hero section JSX (inside the outermost div):
<div className="absolute inset-0 -z-10">
  <SceneCanvas camera={{ position: [0, 0, 6], fov: 70 }}>
    <Hero3DScene />
  </SceneCanvas>
</div>
```

- [ ] **Step 4: Enhance hero text animations with Framer Motion**

Wrap the hero heading with a staggered reveal animation if not already present:

```tsx
import { motion } from "framer-motion";

// Wrap name/title text
<motion.h1
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  {/* existing name */}
</motion.h1>
```

- [ ] **Step 5: Add glitch effect class to name**

In `src/app/globals.css`, add:

```css
@keyframes glitch {
  0%, 100% { text-shadow: none; transform: translate(0); }
  20% { text-shadow: -2px 0 #f0f, 2px 0 #0ff; transform: translate(-1px, 1px); }
  40% { text-shadow: 2px 0 #f0f, -2px 0 #0ff; transform: translate(1px, -1px); }
  60% { text-shadow: -2px 0 #0ff, 2px 0 #f0f; transform: translate(-1px, 0); }
  80% { text-shadow: 2px 0 #0ff, -2px 0 #f0f; transform: translate(1px, 1px); }
}

.glitch-text {
  animation: glitch 4s infinite;
}
```

Apply `.glitch-text` class to the hero name element.

- [ ] **Step 6: Dev-test hero section**

```bash
cd "C:/Users/sdvad/OneDrive/Desktop/projects/3d-portfolio" && npm run dev
```

Open browser → confirm 3D background visible, particles floating, geometry shapes present, text readable, no console errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/hero-3d-scene.tsx src/components/sections/hero.tsx src/app/globals.css
git commit -m "feat: add R3F 3D command center background to hero section"
```

---

### Task 5: Hero Section — Animated Stats Bar & Scroll Indicator

**Files:**
- Create: `src/components/sections/hero-stats.tsx` — animated counters row
- Modify: `src/components/sections/hero.tsx` — add stats and enhanced scroll indicator

**Design:** Below CTA buttons: a horizontal row showing animated counters for "X+ Projects", "Y+ Technologies", "Z Years Experience". Counts animate up on mount.

- [ ] **Step 1: Create hero-stats.tsx**

```tsx
// src/components/sections/hero-stats.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 6, suffix: "+", label: "Projects Shipped" },
  { value: 25, suffix: "+", label: "Technologies" },
  { value: 2, suffix: "+", label: "Years Building" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = (value / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export function HeroStats() {
  return (
    <motion.div
      className="flex gap-8 mt-8 flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <span className="text-3xl font-bold text-violet-400">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </span>
          <span className="text-sm text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 2: Add HeroStats to hero.tsx**

Import and place `<HeroStats />` after the CTA buttons row in hero.tsx.

- [ ] **Step 3: Enhance scroll-down indicator**

Replace or enhance the existing scroll indicator with a pulsing animated chevron:

```tsx
<motion.div
  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
  animate={{ y: [0, 8, 0] }}
  transition={{ repeat: Infinity, duration: 1.5 }}
>
  <span className="text-xs uppercase tracking-widest">Scroll</span>
  {/* existing chevron or arrow icon */}
</motion.div>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/hero-stats.tsx src/components/sections/hero.tsx
git commit -m "feat: add animated stats counters and enhanced scroll indicator to hero"
```

---

## Chunk 3: Skills Section — Interactive Tech Universe

### Task 6: Skills Section — Category Filter Tabs

**Files:**
- Modify: `src/components/sections/skills.tsx`
- Modify: `src/data/constants.ts` — add category field to skills

**Design:** Above the Spline keyboard, add category tabs (All · Frontend · Backend · DevOps · Tools). Clicking a tab filters which skill descriptions are highlighted in the keyboard section. On mobile: shows a filterable card grid instead of the keyboard.

- [ ] **Step 1: Read current skills.tsx and constants.ts**

Read both files fully before any modification.

- [ ] **Step 2: Add category to each skill in constants.ts**

Extend the `SKILLS` record to include a `category` field per skill. Example pattern:

```ts
// In constants.ts, extend SkillItem type:
export type SkillCategory = "frontend" | "backend" | "devops" | "tools";

export type SkillItem = {
  label: string;
  icon: string;
  color: string;
  description: string;
  category: SkillCategory; // ADD THIS
};

// Then add category to each entry. Examples:
[SkillNames.React]: {
  label: "React",
  icon: "...",
  color: "#61dafb",
  description: "...",
  category: "frontend", // ADD
},
[SkillNames.NodeJS]: {
  label: "Node.js",
  icon: "...",
  color: "#3c873a",
  description: "...",
  category: "backend", // ADD
},
// etc for all skills
```

- [ ] **Step 3: Add category filter UI to skills.tsx**

Add state and filter tabs above the keyboard:

```tsx
const CATEGORIES = ["all", "frontend", "backend", "devops", "tools"] as const;
type FilterCat = typeof CATEGORIES[number];

// In component:
const [activeCategory, setActiveCategory] = useState<FilterCat>("all");

const filteredSkills = Object.entries(SKILLS).filter(
  ([_, skill]) => activeCategory === "all" || skill.category === activeCategory
);

// In JSX, above keyboard:
<div className="flex gap-2 justify-center flex-wrap mb-8">
  {CATEGORIES.map((cat) => (
    <motion.button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors",
        activeCategory === cat
          ? "bg-violet-600 text-white"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {cat}
    </motion.button>
  ))}
</div>
```

- [ ] **Step 4: Add mobile skill card grid**

Below the keyboard (or as the primary view on small screens), render filtered skills as cards:

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:hidden mt-8">
  {filteredSkills.map(([name, skill]) => (
    <motion.div
      key={name}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-violet-500 transition-colors cursor-pointer"
    >
      <img src={skill.icon} alt={skill.label} className="w-10 h-10 object-contain" />
      <span className="text-sm font-medium text-center">{skill.label}</span>
    </motion.div>
  ))}
</div>
```

Wrap the grid in Framer Motion `<AnimatePresence mode="popLayout">`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/skills.tsx src/data/constants.ts
git commit -m "feat: add category filter tabs and mobile card grid to skills section"
```

---

### Task 7: Skills Section — 3D Floating Skill Orbs

**Files:**
- Create: `src/components/sections/skills-3d-orbs.tsx` — R3F floating skill spheres
- Modify: `src/components/sections/skills.tsx` — show orbs panel on desktop

**Design:** A side panel (or background) with floating 3D sphere-per-skill. Hovered sphere scales up and shows skill name. Clicking selects it and shows description in a panel below. Visible only on desktop, complements the Spline keyboard.

- [ ] **Step 1: Create skills-3d-orbs.tsx**

```tsx
// src/components/sections/skills-3d-orbs.tsx
"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";
import { SceneCanvas } from "@/components/3d";
import * as THREE from "three";

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
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
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
            <div className="text-xs font-semibold text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap pointer-events-none">
              {orb.name}
            </div>
          </Html>
        )}
      </mesh>
    </Float>
  );
}

interface SkillsOrbsSceneProps {
  skills: SkillOrb[];
  selectedSkill: string | null;
  onSelectSkill: (name: string) => void;
}

function OrbsScene({ skills, selectedSkill, onSelectSkill }: SkillsOrbsSceneProps) {
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

export function SkillsOrbsPanel({
  skills,
  selectedSkill,
  onSelectSkill,
}: SkillsOrbsSceneProps) {
  return (
    <div className="hidden lg:block w-full h-64 rounded-xl overflow-hidden border border-border">
      <SceneCanvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <OrbsScene
          skills={skills}
          selectedSkill={selectedSkill}
          onSelectSkill={onSelectSkill}
        />
      </SceneCanvas>
    </div>
  );
}
```

- [ ] **Step 2: Build skill positions utility**

In `skills-3d-orbs.tsx`, add a helper that converts the skills array into orb objects with spiral positions:

```ts
export function buildSkillOrbs(skills: Array<[string, SkillItem]>): SkillOrb[] {
  return skills.map(([name, skill], i) => {
    const angle = (i / skills.length) * Math.PI * 2;
    const radius = 2.5 + (i % 3) * 0.5;
    const x = Math.cos(angle) * radius * 0.6;
    const y = (Math.sin(angle * 2) * 1.2);
    const z = Math.sin(angle) * 0.5;
    return { name: skill.label, color: skill.color, icon: skill.icon, position: [x, y, z] };
  });
}
```

- [ ] **Step 3: Wire SkillsOrbsPanel into skills.tsx**

Import and render `<SkillsOrbsPanel>` in the skills section, sharing `selectedSkill` state with the filter tabs.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/skills-3d-orbs.tsx src/components/sections/skills.tsx
git commit -m "feat: add 3D floating skill orbs panel to skills section"
```

---

## Chunk 4: Experience Section — Cinematic Timeline

### Task 8: Redesign Experience Section

**Files:**
- Modify: `src/components/sections/experience.tsx`
- Create: `src/components/sections/experience-card.tsx` — individual experience card

**Design:** Vertical timeline with a glowing connecting line. Each experience entry is a card that slides in from the side on scroll (alternating left/right). Company name, role, dates, description bullets, and floating skill tags. GSAP ScrollTrigger drives reveal.

- [ ] **Step 1: Read current experience.tsx**

Read the file fully before modifying.

- [ ] **Step 2: Create experience-card.tsx**

```tsx
// src/components/sections/experience-card.tsx
"use client";

import { motion } from "framer-motion";
import { Calendar, Briefcase } from "lucide-react";

interface ExperienceCardProps {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  descriptions: string[];
  skills: string[];
  index: number;
  side: "left" | "right";
}

export function ExperienceCard({
  title,
  company,
  startDate,
  endDate,
  descriptions,
  skills,
  index,
  side,
}: ExperienceCardProps) {
  const isLeft = side === "left";

  return (
    <motion.div
      className={`flex w-full ${isLeft ? "justify-start" : "justify-end"} relative`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      {/* Timeline dot */}
      <div className="absolute left-1/2 -translate-x-1/2 top-8 w-4 h-4 rounded-full bg-violet-500 border-2 border-background ring-4 ring-violet-500/20 z-10" />

      <div
        className={`w-[45%] p-6 rounded-2xl bg-card border border-border hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10`}
      >
        {/* Header */}
        <div className="flex flex-col gap-1 mb-4">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <div className="flex items-center gap-2 text-violet-400 font-medium">
            <Briefcase className="w-4 h-4" />
            <span>{company}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>
              {startDate} — {endDate}
            </span>
          </div>
        </div>

        {/* Descriptions */}
        <ul className="space-y-2 mb-4">
          {descriptions.map((desc, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2">
              <span className="text-violet-400 mt-0.5 shrink-0">▹</span>
              <span>{desc}</span>
            </li>
          ))}
        </ul>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <motion.span
              key={skill}
              className="px-2 py-0.5 text-xs rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.2)" }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Rewrite experience.tsx with timeline layout**

```tsx
// Core structure for experience.tsx:
// - Section heading via SectionHeader
// - Relative container with a centered vertical gradient line
// - Map over EXPERIENCES data, alternating left/right sides
// - ExperienceCard component per entry
// - Animated timeline line using motion.div height from 0 to 100%

<div className="relative">
  {/* Timeline line */}
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 bg-gradient-to-b from-violet-500 to-transparent"
    initial={{ height: 0 }}
    whileInView={{ height: "100%" }}
    viewport={{ once: true }}
    transition={{ duration: 1.5, ease: "easeInOut" }}
  />

  <div className="flex flex-col gap-12">
    {EXPERIENCES.map((exp, i) => (
      <ExperienceCard
        key={i}
        {...exp}
        index={i}
        side={i % 2 === 0 ? "left" : "right"}
      />
    ))}
  </div>
</div>
```

- [ ] **Step 4: Handle mobile — stack cards full-width**

Add responsive styles so on mobile the cards take full width and the timeline line shows on the left:

```tsx
// Mobile: cards are full-width, no left/right split
// Use Tailwind responsive: md:w-[45%] w-full
// Timeline dot: md:left-1/2 left-4
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/experience.tsx src/components/sections/experience-card.tsx
git commit -m "feat: redesign experience section with cinematic alternating timeline"
```

---

## Chunk 5: Projects Section — 3D Interactive Gallery

### Task 9: Projects Section — 3D Tilt Card Component

**Files:**
- Create: `src/components/sections/project-tilt-card.tsx` — 3D CSS perspective tilt card
- Modify: `src/components/sections/projects.tsx` — use new tilt cards

**Design:** Each project card has a CSS 3D perspective tilt effect driven by mouse position. On hover: card tilts toward the cursor, shows a glowing gradient overlay, and a "View Details" button fades in. Click opens the existing animated modal.

- [ ] **Step 1: Create project-tilt-card.tsx**

```tsx
// src/components/sections/project-tilt-card.tsx
"use client";

import { useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

interface ProjectTiltCardProps {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  onClick: () => void;
}

export function ProjectTiltCard({
  title,
  description,
  image,
  tags,
  liveUrl,
  githubUrl,
  onClick,
}: ProjectTiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = "transform 0.1s ease-out";
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.5s ease-out";
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl overflow-hidden bg-card border border-border cursor-pointer"
      style={{ transformStyle: "preserve-3d" }}
      onClick={onClick}
    >
      {/* Image / preview */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}

      {/* Glow overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-violet-500/10 to-purple-500/5 pointer-events-none" />

      {/* Content */}
      <div className="p-5" style={{ transform: "translateZ(20px)" }}>
        <h3 className="text-lg font-bold mb-2 group-hover:text-violet-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex-1 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
          >
            View Details
          </button>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Read current projects.tsx**

Read the file fully to understand modal integration, data structure, and existing layout.

- [ ] **Step 3: Replace project cards in projects.tsx with ProjectTiltCard**

- Import `ProjectTiltCard`
- Replace each existing card element with `<ProjectTiltCard>` passing props derived from `PROJECTS` data
- Keep modal opening logic — pass `onClick={() => setSelectedProject(project)}` to each card
- Change grid to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

- [ ] **Step 4: Add staggered entrance animation to the grid**

```tsx
<motion.div
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
  variants={{
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
>
  {PROJECTS.map((project, i) => (
    <motion.div
      key={project.title}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      <ProjectTiltCard {...projectToCardProps(project)} onClick={...} />
    </motion.div>
  ))}
</motion.div>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/project-tilt-card.tsx src/components/sections/projects.tsx
git commit -m "feat: replace project cards with interactive 3D tilt cards and stagger animations"
```

---

### Task 10: Project Modal Enhancement

**Files:**
- Modify: `src/components/ui/animated-modal.tsx` — enhance modal with better layout
- Read: `src/data/projects.tsx` — understand project data structure

**Design:** Enhance existing modal to show: project hero image, description, frontend/backend tech split columns, live/github links, and an animated tech stack section with icons.

- [ ] **Step 1: Read animated-modal.tsx and projects.tsx**

Read both files fully.

- [ ] **Step 2: Enhance modal content layout**

Restructure the modal body to have:
- Top: project name + tagline (full width)
- Two columns: Description + Screenshot | Tech Stack
- Bottom: Action buttons (Live Demo, GitHub)

- [ ] **Step 3: Animate tech stack icons on modal open**

```tsx
<motion.div
  className="flex flex-wrap gap-3"
  initial="hidden"
  animate="show"
  variants={{ show: { transition: { staggerChildren: 0.05 } } }}
>
  {techStack.map((tech) => (
    <motion.div
      key={tech.name}
      variants={{ hidden: { opacity: 0, scale: 0 }, show: { opacity: 1, scale: 1 } }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border"
    >
      <img src={tech.icon} alt={tech.name} className="w-4 h-4 object-contain" />
      <span className="text-xs font-medium">{tech.name}</span>
    </motion.div>
  ))}
</motion.div>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/animated-modal.tsx
git commit -m "feat: enhance project modal with tech stack animation and improved layout"
```

---

## Chunk 6: Contact Section — Cosmic Contact Form

### Task 11: Redesign Contact Section

**Files:**
- Modify: `src/components/sections/contact.tsx`
- Create: `src/components/sections/contact-3d-sphere.tsx` — animated R3F sphere
- Modify: `src/components/ContactForm.tsx` — enhanced form with animations

**Design:** Left side: large animated R3F sphere (rotating, wireframe, glowing). Right side: contact form with gradient-border inputs, animated labels, and confetti on successful send.

- [ ] **Step 1: Read contact.tsx and ContactForm.tsx**

Read both files fully before modifying.

- [ ] **Step 2: Create contact-3d-sphere.tsx**

```tsx
// src/components/sections/contact-3d-sphere.tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import { SceneCanvas } from "@/components/3d";
import * as THREE from "three";

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.z = t * 0.1;
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-5, 0, 0]} intensity={0.8} color="#6366f1" />

      {/* Outer wireframe */}
      <mesh ref={meshRef} scale={1.8}>
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
    <div className="w-full h-80 lg:h-full">
      <SceneCanvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <AnimatedSphere />
      </SceneCanvas>
    </div>
  );
}
```

- [ ] **Step 3: Enhance ContactForm.tsx with animated inputs**

In `ContactForm.tsx`, wrap each form field with:

```tsx
// Animated floating label input pattern
<div className="relative group">
  <input
    className="peer w-full px-4 py-3 bg-transparent border border-border rounded-lg text-foreground
               focus:outline-none focus:border-violet-500 transition-colors placeholder-transparent"
    placeholder={label}
    {...register(field)}
  />
  <label className="absolute left-4 top-3 text-muted-foreground text-sm transition-all
                     peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-violet-400
                     peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:text-xs
                     bg-background px-1 cursor-text pointer-events-none">
    {label}
  </label>
  {/* Bottom gradient line */}
  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 group-focus-within:w-full" />
</div>
```

- [ ] **Step 4: Add confetti on form success**

`canvas-confetti` is already installed. In ContactForm.tsx, after successful send:

```tsx
import confetti from "canvas-confetti";

// After successful submission:
confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ["#6366f1", "#8b5cf6", "#c4b5fd"],
});
```

- [ ] **Step 5: Restructure contact.tsx layout**

```tsx
// Two-column layout on desktop, stacked on mobile
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  {/* Left: 3D sphere */}
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <ContactSphere />
  </motion.div>

  {/* Right: Form */}
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2 }}
  >
    <ContactForm />
  </motion.div>
</div>
```

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/contact.tsx src/components/sections/contact-3d-sphere.tsx src/components/ContactForm.tsx
git commit -m "feat: redesign contact section with 3D sphere, animated inputs, and confetti"
```

---

## Chunk 7: Global Polish & Performance

### Task 12: Navigation Enhancement

**Files:**
- Modify: `src/components/header/header.tsx`
- Modify: `src/components/header/nav/` (whichever file contains the nav links)

**Design:** Add active section highlighting to nav links (IntersectionObserver-based). Add a subtle gradient border-bottom to the header on scroll. Add smooth hover underline animations.

- [ ] **Step 1: Read header files**

Read `src/components/header/header.tsx` and nav files.

- [ ] **Step 2: Add active section tracking hook**

Create `src/hooks/useActiveSection.ts`:

```ts
// src/hooks/useActiveSection.ts
"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 }
      );
      observer.observe(element);
      return observer;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, [sectionIds]);

  return activeSection;
}
```

- [ ] **Step 3: Apply active section to nav links**

In the nav component, use `useActiveSection` and add an active style to the current section's nav link:

```tsx
const activeSection = useActiveSection(["hero", "skills", "experience", "projects", "contact"]);

// Per nav link:
<a
  href={`#${section.id}`}
  className={cn(
    "relative text-sm font-medium transition-colors",
    activeSection === section.id
      ? "text-violet-400"
      : "text-muted-foreground hover:text-foreground"
  )}
>
  {section.label}
  {activeSection === section.id && (
    <motion.div
      layoutId="nav-indicator"
      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-400 rounded-full"
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  )}
</a>
```

- [ ] **Step 4: Add scroll-aware header style**

```tsx
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50);
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

// Apply to header element:
className={cn(
  "transition-all duration-300",
  scrolled && "backdrop-blur-md border-b border-border/50 shadow-sm"
)}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/header/ src/hooks/useActiveSection.ts
git commit -m "feat: add active section tracking and scroll-aware header styling"
```

---

### Task 13: Scroll Progress & Page Transitions

**Files:**
- Verify: `src/components/ui/scroll-progress.tsx` — already exists, ensure it's wired up
- Modify: `src/app/page.tsx` — add scroll progress and ensure section IDs match

**Design:** Confirm the scroll progress bar is rendered and visible. Add consistent section IDs so navigation and active-section tracking work correctly.

- [ ] **Step 1: Read page.tsx and scroll-progress.tsx**

Read both files to verify current state.

- [ ] **Step 2: Ensure section IDs are consistent**

In `page.tsx`, each section wrapper should have an `id` that matches the nav:
```tsx
<section id="hero">...</section>
<section id="skills">...</section>
<section id="experience">...</section>
<section id="projects">...</section>
<section id="contact">...</section>
```

- [ ] **Step 3: Ensure scroll-progress is rendered**

In `src/components/app-overlays.tsx` or `layout.tsx`, confirm `<ScrollProgress />` is rendered at the root level.

- [ ] **Step 4: Add section reveal wrapper utility**

Wrap each section with a consistent fade-up reveal:

```tsx
// src/components/ui/section-reveal.tsx
"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function SectionReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/ui/section-reveal.tsx src/components/app-overlays.tsx
git commit -m "feat: standardize section IDs, add section-reveal wrapper, verify scroll progress"
```

---

### Task 14: Performance & Final Polish

**Files:**
- Modify: `src/app/globals.css` — add custom cursor, selection colors, scrollbar
- Modify: `next.config.mjs` — re-enable ESLint during build

**Design:** Final polish pass — custom scrollbar, selection color, ensure no hydration errors, remove console warnings.

- [ ] **Step 1: Add custom scrollbar styles**

In `globals.css`:

```css
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: hsl(var(--background));
}
::-webkit-scrollbar-thumb {
  background: hsl(262 83% 58% / 0.5);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(262 83% 58% / 0.8);
}

/* Text selection color */
::selection {
  background: hsl(262 83% 58% / 0.3);
  color: hsl(var(--foreground));
}
```

- [ ] **Step 2: Re-enable ESLint in next.config.mjs**

```js
// next.config.mjs - remove ignoreDuringBuilds: true
const nextConfig = {
  reactStrictMode: true,
  // Remove: eslint: { ignoreDuringBuilds: true }
};
```

- [ ] **Step 3: Run build and fix any remaining issues**

```bash
cd "C:/Users/sdvad/OneDrive/Desktop/projects/3d-portfolio" && npm run build 2>&1 | tail -30
```

Fix any TypeScript or lint errors that surface.

- [ ] **Step 4: Final dev test**

```bash
npm run dev
```

Test all sections: hero 3D scene, skills filter + orbs, experience timeline, project tilt cards + modals, contact sphere + form. Check mobile responsiveness at 375px width using browser devtools.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "polish: custom scrollbar, selection color, re-enable ESLint, final cleanup"
```

---

## Summary of New Files Created

| File | Purpose |
|---|---|
| `src/components/3d/scene-canvas.tsx` | Reusable R3F Canvas wrapper |
| `src/components/3d/floating-geometry.tsx` | Animated 3D geometric meshes |
| `src/components/3d/particles-field.tsx` | GPU particle field |
| `src/components/3d/index.ts` | Barrel export |
| `src/components/sections/hero-3d-scene.tsx` | R3F scene for hero section |
| `src/components/sections/hero-stats.tsx` | Animated counter stats row |
| `src/components/sections/skills-3d-orbs.tsx` | 3D floating skill orbs panel |
| `src/components/sections/experience-card.tsx` | Individual experience timeline card |
| `src/components/sections/project-tilt-card.tsx` | 3D perspective tilt project card |
| `src/components/sections/contact-3d-sphere.tsx` | Animated R3F sphere for contact |
| `src/components/ui/section-reveal.tsx` | Fade-up scroll reveal wrapper |
| `src/hooks/useActiveSection.ts` | IntersectionObserver section tracking |

## Summary of Modified Files

| File | What Changes |
|---|---|
| `src/contexts/socketio.tsx` | Remove unused `isCurrentUser` state |
| `src/components/realtime/remote-cursors.tsx` | Fix `.values()` type error, fix dependency array |
| `src/components/sections/hero.tsx` | Add 3D scene background, stats row, enhanced scroll indicator |
| `src/components/sections/skills.tsx` | Add category tabs, mobile card grid, orbs panel |
| `src/data/constants.ts` | Add `category` field to each skill |
| `src/components/sections/experience.tsx` | Rewrite with cinematic timeline layout |
| `src/components/sections/projects.tsx` | Swap to tilt cards, stagger entrance |
| `src/components/ui/animated-modal.tsx` | Enhanced modal layout + tech stack animation |
| `src/components/sections/contact.tsx` | Two-column layout with 3D sphere |
| `src/components/ContactForm.tsx` | Animated floating-label inputs, confetti |
| `src/components/header/header.tsx` | Scroll-aware header, active section nav |
| `src/app/page.tsx` | Standardize section IDs |
| `src/app/globals.css` | Glitch keyframes, scrollbar, selection color |
| `next.config.mjs` | Re-enable ESLint |
