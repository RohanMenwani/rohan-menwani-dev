"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { SectionHeader } from "./section-header";
import { SKILLS, type SkillCategory } from "@/data/constants";

const CATEGORIES: Array<{ id: SkillCategory | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "devops", label: "DevOps" },
  { id: "tools", label: "Tools" },
];

const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "all">("all");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const filteredSkills = Object.values(SKILLS).filter(
    (skill) => activeCategory === "all" || skill.category === activeCategory
  );

  return (
    <SectionWrapper
      id="skills"
      className="w-full min-h-screen md:h-auto pointer-events-none py-20"
    >
      <SectionHeader id="skills" title="Tech Stack" desc="Technologies I work with" />

      {/* Category filter tabs */}
      <div className="pointer-events-auto flex gap-2 justify-center flex-wrap mb-10 px-4">
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

      {/* Skill card grid — visible on all screen sizes */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeCategory}
          className="pointer-events-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 px-4 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filteredSkills.map((skill, i) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25, delay: i * 0.03 }}
              onHoverStart={() => setHoveredSkill(skill.name)}
              onHoverEnd={() => setHoveredSkill(null)}
              className="relative flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-card border border-border transition-all duration-300 cursor-default group cursor-can-hover"
              style={{
                borderColor: hoveredSkill === skill.name ? skill.color + "80" : undefined,
                boxShadow: hoveredSkill === skill.name ? `0 0 16px ${skill.color}30` : undefined,
              }}
            >
              {/* Icon */}
              <img
                src={skill.icon}
                alt={skill.label}
                className="w-8 h-8 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
              />

              {/* Name */}
              <span className="text-xs md:text-sm font-medium text-center leading-tight">
                {skill.label}
              </span>

              {/* Color dot */}
              <div
                className="w-1.5 h-1.5 rounded-full opacity-60"
                style={{ backgroundColor: skill.color === "#fff" || skill.color === "#ffffff" ? "#a5b4fc" : skill.color }}
              />

              {/* Tooltip with description on hover */}
              <AnimatePresence>
                {hoveredSkill === skill.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-44 p-2 rounded-lg bg-popover border border-border shadow-xl text-xs text-muted-foreground text-center pointer-events-none"
                  >
                    {skill.shortDescription}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
};

export default SkillsSection;
