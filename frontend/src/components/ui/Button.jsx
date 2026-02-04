import React from "react";

const base =
  "inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};
const variants = {
  default: "bg-[hsl(var(--primary))] text-white shadow",
  outline:
    "border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--primary))]",
  accent: "bg-[hsl(var(--accent))] text-black shadow-glow",
  hero: "h-14 px-8 text-xl bg-[hsl(var(--primary))] text-white shadow",
  success: "bg-[hsl(var(--success))] text-white",
  destructive: "bg-[hsl(var(--destructive))] text-white",
  glass: "glass text-[hsl(var(--muted-foreground))]",
};

const Button = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const cls = [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
};

export default Button;
