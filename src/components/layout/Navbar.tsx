"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ChevronDown, Menu, Volleyball } from "lucide-react";
import { navLinks } from "@/data/nav";
import MagneticButton from "@/components/ui/MagneticButton";
import { useContent } from "@/content/ContentContext";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import type { NavLink as NavLinkType } from "@/types";

/* The two top-level items that open a mega-menu. */
const MEGA: Record<string, "club" | "teams"> = {
  "Le Club": "club",
  "Équipes": "teams",
};

/** Logo lockup — gradient disc + volleyball glyph + VCM wordmark. */
function Logo({ onClick, clubName }: { onClick?: () => void; clubName: string }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${clubName} — accueil`}
      className="group flex shrink-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70"
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-700 via-magenta to-fuchsia-vcm shadow-lg shadow-magenta/30 transition-transform duration-300 group-hover:scale-105">
        <span aria-hidden className="absolute -right-2 -top-2 size-6 rounded-full bg-white/25 blur-md" />
        <Volleyball className="relative size-5 text-white" aria-hidden />
      </span>
      <span className="font-display text-xl uppercase leading-none tracking-tight text-white">
        VCM
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { content } = useContent();
  const { club, teams } = content;
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // refs to each mega-menu trigger (for focus return on Escape)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // delayed-close timer so the pointer can travel trigger -> panel
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 40);
  });
  // initial value (handles refresh mid-page, SSR-safe: runs after mount)
  useEffect(() => {
    setScrolled(scrollY.get() > 40);
  }, [scrollY]);

  // close menus on route change
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }
  // a parent mega item is "active" if the current route is one of its children
  function isParentActive(link: NavLinkType) {
    if (isActive(link.href)) return true;
    return link.children?.some((c) => isActive(c.href)) ?? false;
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <>
      <motion.header
        initial={false}
        className="fixed inset-x-0 top-0 z-40 flex justify-center"
        animate={reduce ? undefined : { paddingTop: scrolled ? 12 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={reduce ? { paddingTop: scrolled ? 12 : 0 } : undefined}
      >
        <motion.div
          initial={false}
          animate={{
            maxWidth: scrolled ? 1120 : 1400,
            backgroundColor: scrolled
              ? "rgba(21, 8, 46, 0.7)"
              : "rgba(21, 8, 46, 0)",
            borderColor: scrolled
              ? "rgba(255,255,255,0.10)"
              : "rgba(255,255,255,0)",
            borderRadius: scrolled ? 9999 : 0,
            boxShadow: scrolled
              ? "0 12px 40px -12px rgba(0,0,0,0.6)"
              : "0 0px 0px 0px rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`mx-3 flex w-full items-center justify-between gap-4 border px-4 py-3 backdrop-blur-xl sm:px-5 lg:mx-4 ${
            scrolled ? "backdrop-blur-xl" : "backdrop-blur-0"
          }`}
        >
          <Logo clubName={club.name} />

          {/* Desktop nav */}
          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-1 lg:flex"
          >
            {navLinks.map((link) => {
              const variant = MEGA[link.label];
              const active = variant ? isParentActive(link) : isActive(link.href);

              if (variant) {
                const isOpen = openMenu === link.label;
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose();
                      setOpenMenu(link.label);
                    }}
                    onMouseLeave={scheduleClose}
                  >
                    <button
                      ref={(el) => {
                        triggerRefs.current[link.label] = el;
                      }}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenMenu((cur) => (cur === link.label ? null : link.label))
                      }
                      onFocus={() => {
                        cancelClose();
                        setOpenMenu(link.label);
                      }}
                      className={`group relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 ${
                        active ? "text-white" : "text-white/70 hover:text-white"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden
                      />
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-vcm"
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                      )}
                    </button>

                    <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
                      <MegaMenu
                        open={isOpen}
                        onClose={() => setOpenMenu(null)}
                        variant={variant}
                        links={link.children}
                        teams={teams}
                        align={variant === "teams" ? "center" : "left"}
                        triggerRef={{
                          get current() {
                            return triggerRefs.current[link.label];
                          },
                        }}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative rounded-full px-3.5 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 ${
                    active ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-vcm"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <MagneticButton
                href="/inscriptions"
                className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-magenta/30 transition-shadow hover:shadow-magenta/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Rejoindre
              </MagneticButton>
            </div>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 lg:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            onClose={() => setMobileOpen(false)}
            isActive={isActive}
          />
        )}
      </AnimatePresence>
    </>
  );
}
