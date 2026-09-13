import type { Metadata } from "next";
import { eventConfig } from "@/data/event";
import { SpiderWebBackground } from "@/components/spider-web-background";
import { WhatsAppJoinCard } from "@/components/whatsapp-join-card";

export const metadata: Metadata = {
  title: `Join the WhatsApp Group | ${eventConfig.eventName} ${eventConfig.edition}`,
  description: `Join the official ${eventConfig.eventName} ${eventConfig.edition} competitors' WhatsApp group.`,
};

// Standalone, shareable version of the join prompt shown after
// registering — for posters, socials, or anyone who dismissed the popup
// and wants the link again later.
export default function JoinPage() {
  return (
    <>
      <SpiderWebBackground />
      <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 py-24 sm:px-8">
        <WhatsAppJoinCard headingId="whatsapp-join-page-title" />
      </section>
    </>
  );
}
