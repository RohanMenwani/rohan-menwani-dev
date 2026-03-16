"use client";

import React from "react";
import { motion } from "framer-motion";
import ContactForm from "../ContactForm";
import { config } from "@/data/config";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import { ContactSphere } from "./contact-3d-sphere";

const ContactSection = () => {
  return (
    <SectionWrapper id="contact" className="min-h-screen max-w-7xl mx-auto">
      <SectionHeader
        id="contact"
        className="relative mb-14"
        title={
          <>
            LET&apos;S WORK <br />
            TOGETHER
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">
        {/* Left: 3D sphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center"
        >
          <ContactSphere />
        </motion.div>

        {/* Right: Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-2xl font-bold mb-2">Get In Touch</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Contact me directly at{" "}
            <a
              target="_blank"
              href={`mailto:${config.email}`}
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              {config.email.replace(/@/g, "(at)")}
            </a>{" "}
            or use the form below.
          </p>
          <ContactForm />
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
