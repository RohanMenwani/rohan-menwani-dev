const config = {
  title: "Rohan Menwani | Full Stack Developer",
  description: {
    long: "Explore the portfolio of Rohan Menwani, a Full Stack Developer with 3+ years of experience building scalable web applications across e-commerce, CRM, and real-time platforms. Specializing in Next.js, NestJS, React, and AWS cloud infrastructure.",
    short:
      "Portfolio of Rohan Menwani — Full Stack Developer specializing in Next.js, NestJS, React, and AWS cloud infrastructure.",
  },
  keywords: [
    "Rohan Menwani",
    "portfolio",
    "full stack developer",
    "Next.js",
    "NestJS",
    "React",
    "TypeScript",
    "AWS",
    "Node.js",
    "web development",
    "GraphQL",
    "PostgreSQL",
    "Ahmedabad",
    "India",
  ],
  author: "Rohan Menwani",
  email: "rishimenwani@gmail.com",
  site: "https://rohan-menwani.vercel.app",

  // for github stars button
  githubUsername: "RohanMenwani",
  githubRepo: "3d-portfolio",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "https://x.com/RohanMenwani",
    linkedin: "https://www.linkedin.com/in/rohan-menwani/",
    instagram: "https://www.instagram.com/rohan.menwani",
    facebook: "https://www.facebook.com/rohan.menwani",
    github: "https://github.com/RohanMenwani",
  },
};
export { config };
