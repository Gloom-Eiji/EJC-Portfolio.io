import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/hero/Hero";
import Codex from "@/components/about/Codex";
import ArmorySection from "@/components/skills/ArmorySection";
import Archives from "@/components/projects/Archives";
import Contact from "@/components/contact/Contact";
import SmoothScroll from "@/components/effects/SmoothScroll";
import Preloader from "@/components/effects/Preloader";
import { profile } from "@/data/profile";

function Divider() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 md:px-10" aria-hidden>
      <div className="rule-ornament font-mono text-xs">✠</div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Navbar resume={profile.resume} />
      <main id="main">
        <Hero />
        <Divider />
        <Codex />
        <Divider />
        <ArmorySection />
        <Divider />
        <Archives />
        <Divider />
        <Contact />
      </main>
    </>
  );
}
