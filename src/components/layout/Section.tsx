import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
  id?: string;
}

export default function Section({ children, tone = "dark", className, id }: SectionProps) {
  const toneClasses =
    tone === "light"
      ? "bg-paper text-encre"
      : "bg-ink text-white/90";

  return (
    <section
      id={id}
      className={[
        "py-20 sm:py-28",
        toneClasses,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}
