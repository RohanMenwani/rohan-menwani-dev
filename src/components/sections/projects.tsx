"use client";
import Image from "next/image";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import { FloatingDock } from "../ui/floating-dock";
import Link from "next/link";
import { motion } from "framer-motion";

import SmoothScroll from "../smooth-scroll";
import projects, { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";
import { ProjectTiltCard } from "./project-tilt-card";

import SectionWrapper from "../ui/section-wrapper";

const ProjectsSection = () => {
  return (
    <SectionWrapper id="projects" className="max-w-7xl mx-auto md:h-[130vh]">
      <SectionHeader id='projects' title="Projects" />
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.src}
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <Modall project={project} />
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
};
const Modall = ({ project }: { project: Project }) => {
  return (
    <Modal>
      <ModalTrigger className="bg-transparent w-full p-0 h-auto">
        <ProjectTiltCard
          title={project.title}
          image={project.src}
          category={project.category}
          liveUrl={project.live}
          onClick={() => {}}
        />
      </ModalTrigger>
      <ModalBody className="md:max-w-4xl md:max-h-[80%] overflow-auto">
        <SmoothScroll isInsideModal={true}>
          <ModalContent>
            <ProjectContents project={project} />
          </ModalContent>
        </SmoothScroll>
        <ModalFooter className="gap-4">
          <button className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28">
            Cancel
          </button>
          <Link href={project.live} target="_blank">
            <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28">
              Visit
            </button>
          </Link>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};
export default ProjectsSection;

const ProjectContents = ({ project }: { project: Project }) => {
  return (
    <>
      {/* Title */}
      <motion.h4
        className="text-lg md:text-2xl font-bold text-center mb-6 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {project.title}
      </motion.h4>

      {/* Tech stack */}
      <motion.div
        className="flex flex-col md:flex-row md:justify-evenly max-w-screen overflow-hidden md:overflow-visible mb-6"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div
          className="flex flex-row md:flex-col-reverse justify-center items-center gap-2 text-3xl mb-8"
          variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
        >
          <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-500">
            Frontend
          </p>
          {project.skills.frontend?.length > 0 && (
            <FloatingDock items={project.skills.frontend} />
          )}
        </motion.div>
        {project.skills.backend?.length > 0 && (
          <motion.div
            className="flex flex-row md:flex-col-reverse justify-center items-center gap-2 text-3xl mb-8"
            variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }}
          >
            <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-500">
              Backend
            </p>
            <FloatingDock items={project.skills.backend} />
          </motion.div>
        )}
      </motion.div>

      {/* Project content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {project.content}
      </motion.div>
    </>
  );
};
