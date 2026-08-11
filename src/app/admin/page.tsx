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
  Search,
  Download,
  ExternalLink,
  Save,
  LogOut,
  Menu,
  RefreshCw,
} from "lucide-react";

import { AdminDraftProvider, useAdminDraft } from "@/admin/useAdminDraft";
import { adminLogout } from "@/admin/AdminAuth";
import { Button, Card, SectionTitle, Toast } from "@/admin/ui";
import TextEditor from "@/admin/editors/TextEditor";
import ClubEditor from "@/admin/editors/ClubEditor";
import StatsEditor from "@/admin/editors/StatsEditor";
import TeamsEditor from "@/admin/editors/TeamsEditor";
import NewsEditor from "@/admin/editors/NewsEditor";
import EventsEditor from "@/admin/editors/EventsEditor";
import PartnersEditor from "@/admin/editors/PartnersEditor";
import GalleryEditor from "@/admin/editors/GalleryEditor";
import FaqEditor from "@/admin/editors/FaqEditor";
import TimelineEditor from "@/admin/editors/TimelineEditor";
import SeoEditor from "@/admin/editors/SeoEditor";
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
  | "seo"
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
  { id: "seo", label: "Référencement & favicon", icon: Search },
  { id: "io", label: "Import / Export", icon: Download },
];

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
  const { ready, dirty, saving, conflict, reload, save, discard } = useAdminDraft();
  const [section, setSection] = useState<SectionId>("dashboard");
  const [navOpen, setNavOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function pushToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
  }

  async function handleSave() {
    const result = await save();
    if (result.ok) {
      pushToast("Publié - visible par tout le monde, sur tous les appareils.");
    } else {
      pushToast(result.error, "error");
    }
  }

  async function handleReload() {
    if (
      dirty &&
      !window.confirm(
        "Récupérer la version en ligne ? Vos modifications non publiées seront perdues.",
      )
    ) {
      return;
    }
    const result = await reload();
    pushToast(
      result.ok ? "Version en ligne récupérée." : result.error,
      result.ok ? "success" : "error",
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 transform flex-col border-r border-white/10 bg-[#15082e] transition-transform lg:static lg:translate-x-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center gap-2 px-6 py-5">
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
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
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
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header bar — hors du flux défilant, donc toujours visible. */}
        <header className="z-20 flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#0a0418]/90 px-4 py-3 backdrop-blur lg:px-8">
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
              {saving ? (
                <span className="inline-flex items-center gap-1.5 text-sky-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  Publication en cours…
                </span>
              ) : conflict ? (
                <span className="inline-flex items-center gap-1.5 text-rose-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  Modifié depuis un autre appareil
                </span>
              ) : dirty ? (
                <span className="inline-flex items-center gap-1.5 text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Modifications non publiées
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  En ligne
                </span>
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
            {conflict && !saving && (
              <Button variant="secondary" onClick={handleReload}>
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Récupérer la version en ligne</span>
              </Button>
            )}
            {dirty && !saving && !conflict && (
              <Button variant="ghost" onClick={discard}>
                Annuler
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!ready || !dirty || saving}
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">
                {saving ? "Publication…" : "Publier"}
              </span>
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
        {/* `relative` : les libellés `sr-only` des éditeurs sont en
            `position:absolute` ; sans ancêtre positionné ils se résolvaient
            contre le document et étiraient sa zone de défilement, ce qui
            laissait la fenêtre défiler de quelques dizaines de pixels. */}
        <main className="relative flex-1 overflow-y-auto px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {!ready ? (
              <p className="text-sm text-white/50">Chargement du contenu…</p>
            ) : section === "dashboard" ? (
              <DashboardHome onNavigate={setSection} />
            ) : section === "text" ? (
              <TextEditor />
            ) : section === "club" ? (
              <ClubEditor />
            ) : section === "stats" ? (
              <StatsEditor />
            ) : section === "teams" ? (
              <TeamsEditor />
            ) : section === "news" ? (
              <NewsEditor />
            ) : section === "events" ? (
              <EventsEditor />
            ) : section === "partners" ? (
              <PartnersEditor />
            ) : section === "gallery" ? (
              <GalleryEditor />
            ) : section === "faq" ? (
              <FaqEditor />
            ) : section === "timeline" ? (
              <TimelineEditor />
            ) : section === "seo" ? (
              <SeoEditor />
            ) : section === "io" ? (
              <ImportExport onToast={pushToast} />
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

