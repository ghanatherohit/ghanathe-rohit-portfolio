
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

export default function Home() {
    return (
      <div className="relative bg-gradient-to-b from-background to-background/90 overflow-hidden dark:from-background dark:to-background/95 cursor-none">
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
