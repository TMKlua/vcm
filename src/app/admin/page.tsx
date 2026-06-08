"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Type,
  Building2,
  BarChart3,
  Users,
  Newspaper,
  CalendarDays,
  Handshake,
  Images,
  HelpCircle,
  History,
  Download,
  ExternalLink,
  Save,
  LogOut,
  Menu,
} from "lucide-react";

import { AdminDraftProvider, useAdminDraft } from "@/admin/useAdminDraft";
import { adminLogout } from "@/admin/AdminAuth";
import { Button, Card, SectionTitle, Toast } from "@/admin/ui";
import TextEditor from "@/admin/editors/TextEditor";
import ClubEditor from "@/admin/editors/ClubEditor";
import ImportExport from "@/admin/editors/ImportExport";

/* ── Section registry ───────────────────────────────────────────────────── */

type SectionId =
  | "dashboard"
  | "text"
  | "club"
  | "stats"
  | "teams"
  | "news"
  | "events"
  | "partners"
  | "gallery"
  | "faq"
  | "timeline"
  | "io";

const SECTIONS: {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "text", label: "Textes du site", icon: Type },
  { id: "club", label: "Infos club", icon: Building2 },
  { id: "stats", label: "Chiffres clés", icon: BarChart3 },
  { id: "teams", label: "Équipes & joueurs", icon: Users },
  { id: "news", label: "Actualités", icon: Newspaper },
  { id: "events", label: "Événements", icon: CalendarDays },
  { id: "partners", label: "Partenaires", icon: Handshake },
  { id: "gallery", label: "Galerie", icon: Images },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "timeline", label: "Historique (timeline)", icon: History },
  { id: "io", label: "Import / Export", icon: Download },
];

const TODO_SECTIONS = new Set<SectionId>([
  "stats",
  "teams",
  "news",
  "events",
  "partners",
  "gallery",
  "faq",
  "timeline",
]);

/* ── Page (wraps the dashboard in the draft provider) ───────────────────── */

export default function AdminPage() {
  return (
    <AdminDraftProvider>
      <Dashboard />
    </AdminDraftProvider>
  );
}

/* ── Dashboard shell ────────────────────────────────────────────────────── */

interface ToastState {
  message: string;
  type: "success" | "error";
}

function Dashboard() {
  const { ready, dirty, save, discard } = useAdminDraft();
  const [section, setSection] = useState<SectionId>("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function pushToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
  }

  function handleSave() {
    save();
    pushToast("Modifications enregistrées.");
  }

  const active = SECTIONS.find((s) => s.id === section);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-[#15082e] transition-transform lg:static lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 px-6 py-5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#ff4dd2] text-sm font-bold text-white">
            V
          </span>
          <div>
            <p className="font-display text-sm uppercase leading-none text-white">
              Admin VCM
            </p>
            <p className="text-[11px] text-white/40">Gestion du contenu</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 pb-6">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSection(id);
                setNavOpen(false);
              }}
              aria-current={section === id ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#a855f7]/40 ${
                section === id
                  ? "bg-gradient-to-r from-[#7c3aed]/30 to-[#c026d3]/20 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {navOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header bar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-[#0a0418]/90 px-4 py-3 backdrop-blur lg:px-8">
          <button
            type="button"
            aria-label="Ouvrir le menu"
            onClick={() => setNavOpen(true)}
            className="rounded-lg p-2 text-white/70 hover:bg-white/5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="font-display text-sm uppercase tracking-wide text-white">
              Administration VCM
            </p>
            <p className="flex items-center gap-2 text-xs text-white/50">
              {ready ? (
                dirty ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Modifications non enregistrées
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    À jour
                  </span>
                )
              ) : (
                "Chargement…"
              )}
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Voir le site</span>
            </a>
            {dirty && (
              <Button variant="ghost" onClick={discard}>
                Annuler
              </Button>
            )}
            <Button variant="primary" onClick={handleSave} disabled={!ready || !dirty}>
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Enregistrer</span>
            </Button>
            <button
              type="button"
              onClick={adminLogout}
              title="Se déconnecter"
              aria-label="Se déconnecter"
              className="rounded-lg p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {!ready ? (
              <p className="text-sm text-white/50">Chargement du contenu…</p>
            ) : section === "dashboard" ? (
              <DashboardHome onNavigate={setSection} />
            ) : section === "text" ? (
              <TextEditor />
            ) : section === "club" ? (
              <ClubEditor />
            ) : section === "io" ? (
              <ImportExport onToast={pushToast} />
            ) : TODO_SECTIONS.has(section) ? (
              <ComingSoon title={active?.label ?? ""} />
            ) : null}
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

function DashboardHome({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const editable = SECTIONS.filter(
    (s) => s.id !== "dashboard" && s.id !== "io",
  );
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Tableau de bord"
        description="Bienvenue dans l'espace d'administration du Volley Club Marseillanais. Sélectionnez une section à modifier."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {editable.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => onNavigate(id)} className="text-left">
            <Card className="flex items-center gap-3 transition hover:border-[#a855f7]/40 hover:bg-[#15082e]">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[#a855f7]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-medium text-white">{label}</span>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <SectionTitle title={title} />
      <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="font-display text-lg uppercase tracking-wide text-white/70">
          À venir
        </p>
        <p className="max-w-sm text-sm text-white/50">
          L&apos;éditeur de cette section sera disponible prochainement.
        </p>
      </Card>
    </div>
  );
}
