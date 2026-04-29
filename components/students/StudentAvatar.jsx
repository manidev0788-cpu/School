"use client";

/** Shared initials for table / profile / form previews */
export function studentInitials(name) {
  const s = String(name ?? "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0][0];
    const b = parts[parts.length - 1][0];
    return `${a}${b}`.toUpperCase();
  }
  return s.slice(0, 2).toUpperCase();
}

const SIZE_MAP = {
  sm: "h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] text-[11px] font-bold",
  form: "h-28 w-28 min-h-[7rem] min-w-[7rem] text-xl font-bold",
  md: "h-24 w-24 min-h-[6rem] min-w-[6rem] text-2xl font-bold",
  lg: "h-36 w-36 min-h-[9rem] min-w-[9rem] text-3xl font-bold",
  /** Hero profile page */
  xl: "h-44 w-44 min-h-[11rem] min-w-[11rem] text-4xl font-bold md:h-48 md:w-48 md:min-h-[12rem] md:min-w-[12rem] md:text-5xl",
};

/**
 * @param {{ name: string; imageUrl?: string | null; size?: 'sm' | 'form' | 'md' | 'lg' | 'xl'; className?: string; alt?: string }} props
 */
export default function StudentAvatar({ name, imageUrl, size = "md", className = "", alt = "" }) {
  const url = typeof imageUrl === "string" && imageUrl.trim() !== "" ? imageUrl.trim() : null;
  const sizeCls = SIZE_MAP[size] ?? SIZE_MAP.md;

  if (url) {
    return (
      <img
        src={url}
        alt={alt || `${name?.trim() || "Student"} profile photo`}
        className={`rounded-full object-cover shadow-inner ring-2 ring-white ${sizeCls} ${className}`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-linear-to-br from-[#1d4ed8] to-sky-500 text-white shadow-inner ring-2 ring-white ${sizeCls} ${className}`}
      aria-hidden={!alt}
    >
      {studentInitials(name)}
    </div>
  );
}
