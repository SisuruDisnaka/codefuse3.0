import { eventConfig } from "@/data/event";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className}>
      <path d="M16.004 2.667c-7.363 0-13.333 5.97-13.333 13.333 0 2.352.615 4.56 1.69 6.475L2.667 29.333l7.02-1.842a13.26 13.26 0 0 0 6.317 1.609h.006c7.363 0 13.333-5.97 13.333-13.333S23.367 2.667 16.004 2.667Zm0 24.4h-.005a11.06 11.06 0 0 1-5.636-1.543l-.404-.24-4.166 1.093 1.112-4.06-.263-.417a11.03 11.03 0 0 1-1.7-5.9c0-6.11 4.973-11.08 11.067-11.08 2.957 0 5.737 1.153 7.827 3.246a10.99 10.99 0 0 1 3.24 7.837c0 6.11-4.972 11.064-11.072 11.064Zm6.07-8.287c-.332-.166-1.965-.97-2.27-1.08-.305-.111-.527-.166-.75.167-.222.333-.86 1.08-1.055 1.302-.194.222-.388.25-.72.083-.332-.167-1.402-.517-2.67-1.65-.987-.881-1.654-1.968-1.848-2.301-.194-.333-.02-.513.146-.678.15-.15.333-.389.5-.583.166-.194.221-.333.332-.556.111-.222.055-.417-.027-.583-.083-.167-.75-1.807-1.027-2.474-.27-.65-.545-.562-.75-.572l-.638-.011c-.222 0-.583.083-.888.417-.305.333-1.166 1.14-1.166 2.78 0 1.64 1.194 3.225 1.36 3.447.166.222 2.35 3.586 5.69 5.03.795.343 1.415.548 1.899.702.798.254 1.524.218 2.098.132.64-.096 1.965-.803 2.242-1.579.277-.777.277-1.443.194-1.58-.083-.138-.305-.221-.639-.388Z" />
    </svg>
  );
}

interface WhatsAppJoinCardProps {
  className?: string;
  headingId?: string;
}

// The join-the-group card itself, matching the official poster design
// (white card, green accents, WhatsApp mark, QR code). Shared between
// the post-registration popup and the standalone /join page so both
// stay visually identical.
export function WhatsAppJoinCard({ className, headingId }: WhatsAppJoinCardProps) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(
    eventConfig.whatsappGroupUrl
  )}`;

  return (
    <div
      className={`relative w-full max-w-sm rounded-[2rem] bg-white pb-8 pt-14 text-center shadow-[0_20px_70px_rgba(0,0,0,0.45)] ${
        className ?? ""
      }`}
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-[0_6px_20px_rgba(16,185,129,0.5)]">
          <WhatsAppIcon className="h-8 w-8 text-white" />
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
        {eventConfig.eventName} {eventConfig.edition}
      </p>
      <h2
        id={headingId}
        className="mt-1 px-6 font-display text-2xl font-bold text-void-950"
      >
        {eventConfig.eventName}-{eventConfig.edition} Competitors
      </h2>
      <p className="text-sm text-void-700/70">WhatsApp group</p>

      <div className="mx-auto mt-6 w-fit rounded-2xl border border-black/5 bg-white p-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
        <img
          src={qrSrc}
          alt="QR code to join the CODEFUSE WhatsApp group"
          width={180}
          height={180}
          className="h-[180px] w-[180px]"
        />
      </div>

      <p className="mx-auto mt-4 max-w-[260px] text-xs text-void-700/60">
        Scan the code, or tap below to join on this device.
      </p>

      <a
        href={eventConfig.whatsappGroupUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-6 mt-5 flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Join WhatsApp Group
      </a>
    </div>
  );
}
