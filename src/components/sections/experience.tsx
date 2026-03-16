"use client";

import { motion } from "framer-motion";
import { EXPERIENCE } from "@/data/constants";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import { ExperienceCard } from "./experience-card";

const ExperienceSection = () => {
  return (
    <SectionWrapper id="experience" className="flex flex-col items-center justify-center min-h-[120vh] py-20 z-10">
      <div className="w-full max-w-4xl px-4 md:px-8 mx-auto">
        <SectionHeader
          id="experience"
          title="Experience"
          desc="My professional journey."
          className="mb-12 md:mb-20 mt-0"
        />

        <div className="flex flex-col gap-12 relative">
          {/* Animated connecting line — desktop only */}
          <motion.div
            className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-0.5 bg-gradient-to-b from-violet-500 via-violet-500/50 to-transparent origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ height: "100%" }}
          />

          {EXPERIENCE.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              title={exp.title}
              company={exp.company}
              startDate={exp.startDate}
              endDate={exp.endDate}
              descriptions={exp.description}
              skills={exp.skills}
              index={i}
              side={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ExperienceSection;
