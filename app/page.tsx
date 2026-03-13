import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MouseFollower from "@/components/ui/MouseFollower";
import DarkModeIndicator from "@/components/ui/DarkModeIndicator";
import Achievements from "@/components/Certifications";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ghanathe-rohit-portfolio.vercel.app";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Ghanathe Rohit Portfolio",
      description:
        "Portfolio of Ghanathe Rohit, a full-stack web developer specializing in JavaScript, React.js, Next.js, Node.js, MySQL, and MongoDB.",
      inLanguage: "en",
      publisher: {
        "@id": `${SITE_URL}/#person`,
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Ghanathe Rohit",
      alternateName: ["Rohit Ghanathe", "ghanathe rohit"],
      url: SITE_URL,
      image: `${SITE_URL}/preview.png`,
      jobTitle: "Full-Stack Web Developer",
      description:
        "Aspiring Full Stack Web Developer skilled in JavaScript, React.js, Next.js, Node.js, MySQL, and MongoDB. Experienced in building responsive web applications and REST APIs.",
      sameAs: [
        "https://github.com/ghanatherohit",
        "https://www.linkedin.com/in/ghanatherohit",
      ],
      knowsAbout: [
        "JavaScript",
        "React.js",
        "Next.js",
        "Node.js",
        "Express.js",
        "MySQL",
        "MongoDB",
        "C++",
        "HTML",
        "CSS",
        "Bootstrap",
        "Tailwind CSS",
        "Git",
        "GitHub",
        "REST APIs",
      ],
      mainEntityOfPage: {
        "@id": `${SITE_URL}/#website`,
      },
    },
  ],
};

export default function Home() {
    return (
      <div className="relative bg-gradient-to-b from-background to-background/90 overflow-hidden dark:from-background dark:to-background/95 cursor-none">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <MouseFollower />
        <DarkModeIndicator />
        <main className="min-h-screen max-w-screen-2xl mx-auto px-5 py-6 font-primary">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Achievements />
          <Contact />
        </main>
        <Footer />
      </div>
    );
}
