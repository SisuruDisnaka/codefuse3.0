interface AvatarProps {
  name: string;
  photo?: string;
  size?: number;
}

function getInitials(name: string): string {
  if (!name || name === "TBA") return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

// Renders a real photo when one is provided in the data file; otherwise
// falls back to a purple initials badge so the layout still reads as a
// "people" section before official photos are supplied.
export function Avatar({ name, photo, size = 72 }: AvatarProps) {
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={photo}
        alt={name}
        width={size}
        height={size}
        className="rounded-full border border-purple-primary/40 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full border border-purple-primary/40 bg-gradient-to-br from-purple-primary/50 to-void-700 font-display font-semibold text-ink-100 shadow-[0_0_16px_rgba(124, 77, 255,0.25)]"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {getInitials(name)}
    </div>
  );
}
