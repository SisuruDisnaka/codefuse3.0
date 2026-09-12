import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/about-section";
import { RoadmapPreview } from "@/components/roadmap-preview";
import { RulesPreview } from "@/components/rules-preview";
import { WinnersPreview } from "@/components/winners-preview";
import { OrganizersPreview } from "@/components/organizers-preview";
import { RegistrationCta } from "@/components/registration-cta";
import { SkillsWeb } from "@/components/skills-web";
import { SpiderWebBackground } from "@/components/spider-web-background";

export default function HomePage() {
  return (
    <>
      <SpiderWebBackground />
      <Hero />
      <AboutSection />
      <RoadmapPreview />
      <RulesPreview />
      <WinnersPreview />
      <OrganizersPreview />
      <RegistrationCta />
      <SkillsWeb />
    </>
  );
}
