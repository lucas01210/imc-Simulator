"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type PixelButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "ghost";
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export default function PixelButton({
  children,
  href,
  className = "",
  variant = "primary",
  ...props
}: PixelButtonProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold " +
    "shadow-pixel transition-transform duration-150 " +
    "border active:translate-y-[1px] active:shadow-none hover:brightness-110 " +
    "disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:brightness-100 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffaa]/40 focus-visible:ring-offset-1";

  const variantClass =
    variant === "ghost"
      ? "border-[#00ffaa]/18 bg-[#070a0f]/40 text-[#e8eef6]"
      : "border-[#00ffaa]/35 bg-[#070a0f]/80 text-[#e8eef6]";

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,255,170,0.18), transparent 35%, rgba(0,255,170,0.12))",
        }}
      />
      {/* Click feedback (active state) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 scale-90 transition-all duration-150 group-active:opacity-100 group-active:scale-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,255,170,0.16), rgba(0,255,170,0.02))",
        }}
      />
      <span className="relative">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${base} ${variantClass} ${className}`}>
        {inner}
      </Link>
    );
  }

  return (
    <button {...props} className={`${base} ${variantClass} ${className}`}>
      {inner}
    </button>
  );
}

