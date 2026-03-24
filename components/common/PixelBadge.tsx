import type { ReactNode } from "react";

export default function PixelBadge({
  children,
  tone = "mint",
  className = "",
}: {
  children: ReactNode;
  tone?: "mint" | "warn" | "danger";
  className?: string;
}) {
  const styles: Record<string, string> = {
    mint: "border-[#00ffaa]/35 bg-[#070a0f]/70 text-[#00ffaa]",
    warn: "border-[#ffd166]/35 bg-[#070a0f]/70 text-[#ffd166]",
    danger: "border-[#ff4d6d]/35 bg-[#070a0f]/70 text-[#ff4d6d]",
  };

  return (
    <span
      className={[
        "inline-flex items-center px-2 py-1 text-[11px] font-semibold",
        "border shadow-pixel",
        styles[tone],
        "leading-none",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

