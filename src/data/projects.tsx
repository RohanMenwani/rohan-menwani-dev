import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from "react-icons/ri";
import {
  SiFirebase,
  SiGraphql,
  SiNestjs,
  SiOpenai,
  SiPostgresql,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";

const BASE_PATH = "/assets/projects-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      <Link
        className="font-mono underline flex gap-2"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} size={"sm"}>
          Visit Website
          <ArrowUpRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            GitHub
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

const PROJECT_SKILLS = {
  next: {
    title: "Next.js",
    bg: "black",
    fg: "white",
    icon: <RiNextjsFill />,
  },
  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },
  node: {
    title: "Node.js",
    bg: "black",
    fg: "white",
    icon: <RiNodejsFill />,
  },
  nestjs: {
    title: "NestJS",
    bg: "black",
    fg: "white",
    icon: <SiNestjs />,
  },
  postgres: {
    title: "PostgreSQL",
    bg: "black",
    fg: "white",
    icon: <SiPostgresql />,
  },
  graphql: {
    title: "GraphQL",
    bg: "black",
    fg: "white",
    icon: <SiGraphql />,
  },
  firebase: {
    title: "Firebase",
    bg: "black",
    fg: "white",
    icon: <SiFirebase />,
  },
  openai: {
    title: "OpenAI API",
    bg: "black",
    fg: "white",
    icon: <SiOpenai />,
  },
  ts: {
    title: "TypeScript",
    bg: "black",
    fg: "white",
    icon: <SiTypescript />,
  },
  tailwind: {
    title: "Tailwind CSS",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  framerMotion: {
    title: "Framer Motion",
    bg: "black",
    fg: "white",
    icon: <TbBrandFramerMotion />,
  },
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "ai-assessment-platform",
    category: "AI / EdTech",
    title: "AI English Assessment Platform",
    src: "/assets/projects-screenshots/ai-assessment/landing.png",
    screenshots: ["landing.png"],
    live: "#",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.nestjs,
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.openai,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A full-stack AI-powered English assessment platform built for a
            Singapore-based client. Features Vocabulary, Cloze, and
            Comprehension test modules with fully automated AI evaluation,
            intelligent retry generation, and real-time analytics.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">AI-Driven Evaluation</TypographyH3>
          <p className="font-mono mb-2">
            Integrated OpenAI API for automated answer evaluation, dynamic
            scoring, and intelligent question generation from both handwritten
            and digital documents — removing the need for manual grading entirely.
          </p>
          <SlideShow images={[`${BASE_PATH}/ai-assessment/landing.png`, `${BASE_PATH}/ai-assessment/problems.png`]} />

          <TypographyH3 className="my-4 mt-8">Three-App Architecture</TypographyH3>
          <p className="font-mono mb-2">
            Architected three separate applications: a Student Portal for taking
            tests and tracking progress, an Admin Dashboard for managing content
            and analytics, and a NestJS Backend API with secure JWT
            authentication and Role-Based Access Control (RBAC).
          </p>

          <TypographyH3 className="my-4 mt-8">Payments & Analytics</TypographyH3>
          <p className="font-mono mb-2">
            Integrated Hitpay payment gateway for subscription management.
            Developed ranking systems, detailed progress tracking dashboards, and
            analytics for both students and administrators.
          </p>
          <SlideShow images={[`${BASE_PATH}/ai-assessment/dashboard.png`]} />
        </div>
      );
    },
  },
  {
    id: "tristar-crm",
    category: "CRM / Enterprise",
    title: "Tri Star Sports & Entertainment CRM",
    src: "/assets/projects-screenshots/tristar-crm/landing.png",
    screenshots: ["landing.png"],
    live: "#",
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.graphql,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [
        PROJECT_SKILLS.nestjs,
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.firebase,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            Enterprise-grade CRM system built for a sports and entertainment
            company, managing 500+ active client profiles with real-time mobile
            synchronization and advanced data visualization for talent management.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">GraphQL API & Performance</TypographyH3>
          <p className="font-mono mb-2">
            Implemented a GraphQL API with NestJS backend, optimizing complex
            relational queries and reducing average API response times by 40%
            compared to the previous REST architecture.
          </p>
          <SlideShow images={[`${BASE_PATH}/tristar-crm/landing.png`]} />

          <TypographyH3 className="my-4 mt-8">Real-Time Sync</TypographyH3>
          <p className="font-mono mb-2">
            Integrated Firebase for real-time mobile synchronization, ensuring
            that all 500+ client profiles and talent records are always up-to-date
            across web and mobile platforms without manual refresh.
          </p>

          <TypographyH3 className="my-4 mt-8">Dashboard & Data Visualization</TypographyH3>
          <p className="font-mono mb-2">
            Built a React.js dashboard with advanced filtering, search, and data
            visualization components tailored to sports talent management workflows.
            Designed a normalized PostgreSQL schema with indexes for efficient
            relational data retrieval.
          </p>
          <SlideShow images={[`${BASE_PATH}/tristar-crm/dashboard.png`, `${BASE_PATH}/tristar-crm/analytics.png`]} />
        </div>
      );
    },
  },
  {
    id: "portfolio",
    category: "Portfolio",
    title: "This Portfolio",
    src: "/assets/projects-screenshots/portfolio/landing-new.png",
    screenshots: ["landing-new.png"],
    live: "https://rohan-menwani.vercel.app",
    github: "https://github.com/RohanMenwani/3d-portfolio",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.framerMotion,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono">
            A fully interactive 3D portfolio built with Next.js 14, React Three
            Fiber, Framer Motion, and GSAP. Every section has its own 3D layer —
            from a particle field hero to floating skill orbs and an animated
            contact sphere.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />

          <TypographyH3 className="my-4 mt-8">3D Scenes per Section</TypographyH3>
          <p className="font-mono mb-2">
            Built custom React Three Fiber scenes for the hero (floating
            geometries + particle stars with mouse parallax), skills (interactive
            floating orbs), and contact (distorted animated sphere) sections.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/landing.png`, `${BASE_PATH}/portfolio/skills.png`]} />

          <TypographyH3 className="my-4 mt-8">Cinematic Animations</TypographyH3>
          <p className="font-mono mb-2">
            Framer Motion drives all scroll-triggered reveals, the experience
            timeline slide-ins, and project card stagger animations. GSAP +
            ScrollTrigger handles the Spline 3D keyboard transitions.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/projects.png`, `${BASE_PATH}/portfolio/project.png`]} />

          <TypographyH3 className="my-4 mt-8">Real-Time Collaboration Layer</TypographyH3>
          <p className="font-mono mb-2">
            Includes an optional Socket.io layer for live visitor cursors,
            real-time chat, and online user count — making the portfolio itself
            a live collaborative experience.
          </p>
        </div>
      );
    },
  },
];

export default projects;
