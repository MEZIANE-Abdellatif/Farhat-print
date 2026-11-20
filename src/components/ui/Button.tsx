import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp";

const variants: Record<Variant, string> = {
  primary:
    "bg-cyan-300 text-ink hover:bg-white focus-visible:outline-cyan-300",
  secondary:
    "bg-white/10 text-paper border border-white/15 hover:bg-white/20 focus-visible:outline-cyan-300",
  ghost:
    "bg-transparent text-paper hover:bg-white/8 focus-visible:outline-cyan-300",
  whatsapp:
    "bg-emerald-500 text-white hover:bg-emerald-400 focus-visible:outline-emerald-500",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
