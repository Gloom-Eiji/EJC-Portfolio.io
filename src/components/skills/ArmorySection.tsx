import SectionHeading from "@/components/ui/SectionHeading";
import Armory from "./Armory";

export default function ArmorySection() {
  return (
    <section id="armory" aria-labelledby="armory-title" className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
      <SectionHeading
        id="armory-title"
        numeral="II"
        label="The Armory"
        title="Arms, armor & arcana"
        kicker="My technical inventory: languages, frameworks, infrastructure, AI and security tooling. Inspect an item to see where it was forged and wielded, or equip a loadout to find the projects that called for it."
      />
      <Armory />
    </section>
  );
}
