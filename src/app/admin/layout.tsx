import type { Metadata } from "next";
import AdminAuth from "@/admin/AdminAuth";

export const metadata: Metadata = {
  title: "Administration · VCM",
  // Never index or follow the admin area.
  robots: { index: false, follow: false },
};

/**
 * Admin layout — gated by the client password screen and given a dark, clean
 * background of its own. It lives OUTSIDE the (site) route group, so it never
 * renders the public Navbar/Footer/Loader/Cursor.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // `min-h-dvh` et non `min-h-screen` : la page d'admin mesure exactement
  // 100dvh, et sur mobile `100vh` est plus grand que `100dvh` — l'écart aurait
  // suffi à réintroduire un défilement de la fenêtre.
  return (
    <div className="min-h-dvh bg-[#0a0418] text-[#ece4ff]">
      <AdminAuth>{children}</AdminAuth>
    </div>
  );
}
