"use client";

import { useRef, type MouseEvent } from "react";
import { ExternalLink, Github } from "lucide-react";

interface ProjectTiltCardProps {
  title: string;
  description?: string;
  image: string;
  category: string;
  liveUrl?: string;
  onClick: () => void;
}

export function ProjectTiltCard({
  title,
  description,
  image,
  category,
  liveUrl,
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
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
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
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-black/60 text-white border border-white/20">
            {category}
          </span>
        </div>
      </div>

      {/* Glow overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-violet-500/10 to-purple-500/5 pointer-events-none" />

      {/* Content */}
      <div className="p-5" style={{ transform: "translateZ(20px)" }}>
        <h3 className="text-lg font-bold mb-3 group-hover:text-violet-400 transition-colors">
          {title}
        </h3>

        {/* Actions — reveal on hover */}
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex-1 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
          >
            View Details
          </button>
          {liveUrl && liveUrl !== "#" && (
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
