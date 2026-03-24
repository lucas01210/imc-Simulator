import type { ReactNode } from "react";

export default function PixelCard({
  children,
  className = "",
  tone = "mint",
}: {
  children: ReactNode;
  className?: string;
  tone?: "mint" | "neutral";
}) {
  return (
    <section
      className={[
        "relative overflow-hidden border shadow-pixel",
        tone === "mint"
          ? "border-[#00ffaa]/18 bg-[#06080d]/45"
          : "border-[#7f8aa3]/18 bg-[#06080d]/35",
        "px-4 py-3 sm:px-5 sm:py-4",
        className,
      ].join(" ")}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,255,170,0.12), rgba(0,255,170,0.02) 35%, rgba(0,255,170,0.0))",
        }}
      />
    </section>
  );
}

