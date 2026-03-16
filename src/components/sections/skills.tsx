"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";
import { SKILLS, type SkillCategory } from "@/data/constants";
import { SkillsOrbsPanel } from "./skills-3d-orbs";

const CATEGORIES: Array<{ id: SkillCategory | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "devops", label: "DevOps" },
  { id: "tools", label: "Tools" },
];

const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const filteredSkills = Object.values(SKILLS).filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <SectionWrapper id="skills" className="w-full h-screen md:h-[150dvh] pointer-events-none">
      <SectionHeader id="skills" title="Tech Stack" desc="(hint: press a key)" />

      {/* Category filter tabs — pointer-events-auto so they're clickable */}
      <div className="pointer-events-auto flex gap-2 justify-center flex-wrap mb-8 px-4">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors",
              activeCategory === cat.id
                ? "bg-violet-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* 3D skill orbs — desktop only */}
      <div className="pointer-events-auto hidden lg:block px-4 mb-6">
        <SkillsOrbsPanel
          skills={filteredSkills}
          selectedSkill={selectedSkill}
          onSelectSkill={setSelectedSkill}
        />
      </div>

      {/* Mobile skill card grid — only visible on small screens */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeCategory}
          className="pointer-events-auto grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filteredSkills.map((skill, i) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-violet-500 transition-colors cursor-pointer"
            >
              <img
                src={skill.icon}
                alt={skill.label}
                className="w-10 h-10 object-contain"
              />
              <span className="text-sm font-medium text-center">{skill.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
};

export default SkillsSection;
