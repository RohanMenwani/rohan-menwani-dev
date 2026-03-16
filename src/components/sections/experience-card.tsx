"use client";

import { motion } from "framer-motion";
import { Calendar, Briefcase } from "lucide-react";
import { SKILLS, type SkillNames } from "@/data/constants";
import { Badge } from "@/components/ui/badge";

interface ExperienceCardProps {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  descriptions: string[];
  skills: SkillNames[];
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
      className={`flex w-full ${isLeft ? "md:justify-start justify-center" : "md:justify-end justify-center"} relative`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      {/* Timeline dot — desktop only */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-8 w-4 h-4 rounded-full bg-violet-500 border-2 border-background ring-4 ring-violet-500/20 z-10" />

      <div className="w-full md:w-[45%] p-6 rounded-2xl bg-card border border-border hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10">
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
          {skills.map((skillName) => {
            const skill = SKILLS[skillName];
            if (!skill) return null;
            return (
              <motion.div key={skillName} whileHover={{ scale: 1.1 }}>
                <Badge
                  variant="outline"
                  className="gap-1.5 text-xs font-normal bg-violet-500/10 text-violet-300 border-violet-500/20 hover:bg-violet-500/20 transition-colors cursor-default"
                >
                  <img
                    src={skill.icon}
                    alt={skill.label}
                    className="w-3 h-3 object-contain"
                  />
                  {skill.label}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
