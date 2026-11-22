"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Heart, Loader2, Lock, ShieldCheck, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/components/shop/CartContext";
import Portal from "@/components/shop/Portal";
import ProductVisual from "@/components/shop/ProductVisual";
import { DONATIONS } from "@/data/order";
import { colorByName, DELIVERY_OPTIONS, findProduct, formatPrice, unitPrice } from "@/data/shop";

const EASE = [0.16, 1, 0.3, 1] as const;

const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/25 focus:border-fuchsia-vcm/60 aria-[invalid=true]:border-fuchsia-vcm";

type Form = { firstName: string; lastName: string; email: string; phone: string; licensed: boolean; team: string; player: string };

function validate(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  // Mêmes règles que HelloAsso, pour prévenir avant la redirection.
  const name = (v: string, label: string) =>
    !v.trim() ? `${label} requis` : v.trim().length < 2 ? `${label} trop court` : /\d/.test(v) ? `${label} sans chiffres` : undefined;
  const fn = name(f.firstName, "Prénom");
  const ln = name(f.lastName, "Nom");
  if (fn) e.firstName = fn;
  if (ln) e.lastName = ln;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "E-mail invalide";
  if (f.phone && !/^[+\d][\d\s.]{8,}$/.test(f.phone)) e.phone = "Téléphone invalide";
  return e;
}

/** Logo HelloAsso simplifié (cœur), pour le bouton de paiement. */
function HelloAssoMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5">
      <path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

export default function CheckoutView() {
  const { lines, subtotal, count } = useCart();
  const [form, setForm] = useState<Form>({ firstName: "", lastName: "", email: "", phone: "", licensed: false, team: "", player: "" });
  const [touched, setTouched] = useState(false);
  const [delivery, setDelivery] = useState<(typeof DELIVERY_OPTIONS)[number]["key"]>("gymnase");
  const [donation, setDonation] = useState(0);
  const [preview, setPreview] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const errors = validate(form);
  const shipping = DELIVERY_OPTIONS.find((d) => d.key === delivery)?.price ?? 0;
  const total = subtotal + shipping + donation;
  const step = lines.length === 0 ? 0 : Object.keys(errors).length ? 1 : 2;

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function pay() {
    setTouched(true);
    if (Object.keys(errors).length) {
      document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
      return;
    }
    if (paying) return;
    setPaying(true);
    setPayError("");
    try {
      const res = await fetch("/api/helloasso/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map(({ slug, color, size, flocage, qty }) => ({ slug, color, size, flocage, qty })),
          delivery,
          donation,
          customer: form,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { redirectUrl?: string; error?: string };
      // Clés HelloAsso absentes : aperçu de ce qui serait envoyé.
      if (res.status === 503) {
        setPreview(true);
        setPaying(false);
        return;
      }
      if (!res.ok || !data.redirectUrl) throw new Error(data.error ?? "Le paiement n'a pas pu être lancé.");
      // Le bouton reste en attente pendant la redirection vers HelloAsso.
      window.location.assign(data.redirectUrl);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Le paiement n'a pas pu être lancé.");
      setPaying(false);
    }
  }

  if (lines.length === 0) {
    return (
      <section className="grid min-h-[80vh] place-items-center bg-ink px-5 pt-32 text-center">
        <div>
          <ShoppingBag className="mx-auto size-14 text-white/20" aria-hidden />
          <h1 className="mt-6 font-display text-5xl text-white">Panier vide</h1>
          <p className="mt-3 text-white/70">Ajoutez quelques articles avant de passer commande.</p>
          <Link href="/boutique" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-700 via-magenta to-fuchsia-vcm px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white">
            <ArrowLeft className="size-4" aria-hidden /> Retour à la boutique
          </Link>
        </div>
      </section>
    );
  }

  const err = (k: keyof Form) => (touched ? errors[k] : undefined);

  return (
    <section className="relative isolate bg-ink pb-24 pt-28 sm:pt-36">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-0 -z-10 size-[600px] rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(ellipse, rgba(192,38,211,0.9), transparent 65%)" }} />
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <Link href="/boutique" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
          <ArrowLeft className="size-4" aria-hidden /> Continuer mes achats
        </Link>
        <h1 className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.92] text-white">Ma commande</h1>

        {/* Stepper */}
        <ol className="mt-8 flex max-w-xl items-center gap-3 text-xs font-semibold uppercase tracking-wider">
          {["Panier", "Coordonnées", "Paiement"].map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-3">
                <span className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors ${done ? "border-transparent bg-gradient-to-br from-violet-700 to-fuchsia-vcm text-white" : current ? "border-fuchsia-vcm text-white" : "border-white/20 text-white/50"}`}>
                  {done ? <Check className="size-4" aria-hidden /> : i + 1}
                </span>
                <span className={`${current ? "" : "hidden sm:inline"} ${current || done ? "text-white" : "text-white/50"}`}>{label}</span>
                {i < 2 && <span className="h-px flex-1 bg-white/15" aria-hidden />}
              </li>
            );
          })}
        </ol>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-8">
            {/* Coordonnées */}
            <fieldset className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <legend className="px-2 font-display text-2xl text-white">Mes coordonnées</legend>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                {([
                  ["firstName", "Prénom", "given-name", "text"],
                  ["lastName", "Nom", "family-name", "text"],
                  ["email", "E-mail", "email", "email"],
                  ["phone", "Téléphone (facultatif)", "tel", "tel"],
                ] as const).map(([k, label, auto, type]) => (
                  <label key={k} className="text-sm text-white/70">
                    {label}
                    <input
                      type={type}
                      autoComplete={auto}
                      value={form[k]}
                      onChange={(e) => set(k, e.target.value)}
                      aria-invalid={Boolean(err(k))}
                      aria-describedby={err(k) ? `${k}-err` : undefined}
                      className={inputClass}
                    />
                    {err(k) && <span id={`${k}-err`} className="mt-1 block text-xs text-fuchsia-vcm">{err(k)}</span>}
                  </label>
                ))}
              </div>
              <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm text-white">
                <input type="checkbox" checked={form.licensed} onChange={(e) => set("licensed", e.target.checked)} className="size-5 accent-fuchsia-vcm" />
                Je suis licencié(e) au VCM, ou parent d&apos;un licencié
              </label>
              <AnimatePresence initial={false}>
                {form.licensed && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="grid gap-4 pt-4 sm:grid-cols-2">
                      <label className="text-sm text-white/70">
                        Équipe
                        <input value={form.team} onChange={(e) => set("team", e.target.value)} placeholder="Ex. M15 filles" className={inputClass} />
                      </label>
                      <label className="text-sm text-white/70">
                        Nom du joueur / de la joueuse
                        <input value={form.player} onChange={(e) => set("player", e.target.value)} className={inputClass} />
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </fieldset>

            {/* Remise */}
            <fieldset className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <legend className="px-2 font-display text-2xl text-white">Retrait ou livraison</legend>
              <div className="mt-2 grid gap-3">
                {DELIVERY_OPTIONS.map((d) => (
                  <label key={d.key} className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors ${delivery === d.key ? "border-fuchsia-vcm/60 bg-fuchsia-vcm/[0.06]" : "border-white/10 hover:border-white/25"}`}>
                    <input type="radio" name="delivery" value={d.key} checked={delivery === d.key} onChange={() => setDelivery(d.key)} className="size-5 accent-fuchsia-vcm" />
                    <span className="flex-1">
                      <span className="block font-semibold text-white">{d.label}</span>
                      <span className="text-sm text-white/60">{d.detail}</span>
                    </span>
                    <span className="font-semibold text-white">{d.price ? formatPrice(d.price) : "Gratuit"}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Arrondi solidaire */}
            <fieldset className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-700/15 to-fuchsia-vcm/5 p-6 sm:p-8">
              <legend className="flex items-center gap-2 px-2 font-display text-2xl text-white">
                <Heart className="size-5 text-fuchsia-vcm" aria-hidden /> Un petit plus pour le club ?
              </legend>
              <p className="mt-2 text-sm text-white/70">Un don facultatif, reversé intégralement aux équipes jeunes du VCM.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {DONATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={donation === d}
                    onClick={() => setDonation(d)}
                    className={`relative min-h-11 rounded-full border px-5 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-vcm/70 ${donation === d ? "border-transparent text-white" : "border-white/15 text-white/80 hover:border-white/40"}`}
                  >
                    {donation === d && <motion.span layoutId="don-pill" className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-vcm" transition={{ duration: 0.3, ease: EASE }} />}
                    {d === 0 ? "Non merci" : `+${formatPrice(d)}`}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Récapitulatif */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-white/10 bg-night p-6 sm:p-8">
              <h2 className="font-display text-2xl text-white">Récapitulatif <span className="text-white/60">({count})</span></h2>
              <ul className="mt-5 flex flex-col gap-4">
                {lines.map((l) => {
                  const p = findProduct(l.slug);
                  if (!p) return null;
                  const color = colorByName(p, l.color);
                  return (
                    <li key={l.id} className="flex items-center gap-4">
                      <span className="relative grid size-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-700/30 to-fuchsia-vcm/10">
                        <ProductVisual product={p} color={color} className="size-14" shadow={false} />
                        <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-white text-[0.65rem] font-bold text-encre">{l.qty}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white">{p.name}</span>
                        <span className="block truncate text-xs text-white/60">
                          {color.name}{l.size ? ` · ${l.size}` : ""}{l.flocage?.name || l.flocage?.number ? ` · ${[l.flocage.name, l.flocage.number].filter(Boolean).join(" ")}` : ""}
                        </span>
                      </span>
                      <span className="text-sm font-semibold text-white">{formatPrice(unitPrice(p, l.flocage) * l.qty)}</span>
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
                <div className="flex justify-between text-white/70"><dt>Sous-total</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div className="flex justify-between text-white/70"><dt>Livraison</dt><dd>{shipping ? formatPrice(shipping) : "Gratuit"}</dd></div>
                {donation > 0 && <div className="flex justify-between text-white/70"><dt>Don au club</dt><dd>{formatPrice(donation)}</dd></div>}
                <div className="flex items-baseline justify-between pt-3">
                  <dt className="font-semibold text-white">Total TTC</dt>
                  <dd className="font-display text-4xl text-white">{formatPrice(total)}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={pay}
                disabled={paying}
                aria-busy={paying}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#49d38a] px-6 py-4 text-sm font-bold uppercase tracking-wide text-[#0b2a1b] shadow-xl shadow-[#49d38a]/20 outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
              >
                {paying ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <HelloAssoMark />}
                {paying ? "Redirection vers HelloAsso…" : "Payer avec HelloAsso"}
              </button>
              {payError && (
                <p role="alert" className="mt-3 text-center text-sm text-fuchsia-vcm">
                  {payError}
                </p>
              )}
              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/60">
                <Lock className="size-3.5" aria-hidden /> Paiement sécurisé, reçu envoyé par e-mail
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Aperçu du paiement (HelloAsso non branché) */}
      <Portal>
      <AnimatePresence>
        {preview && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/80 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreview(false)} data-lenis-prevent>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="apercu-titre"
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-night p-7"
              initial={{ y: 30, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === "Escape" && setPreview(false)}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-[#49d38a] text-[#0b2a1b]"><ShieldCheck className="size-6" aria-hidden /></span>
                <button type="button" autoFocus onClick={() => setPreview(false)} aria-label="Fermer" className="grid size-10 place-items-center rounded-full bg-white/5 text-white hover:bg-white/10">
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <h2 id="apercu-titre" className="mt-5 font-display text-3xl text-white">Aperçu : redirection HelloAsso</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Une fois le paiement branché, ce bouton vous enverrait sur la page de paiement sécurisée HelloAsso du club, puis
                vous ramènerait ici avec la confirmation de commande. Aucun paiement n&apos;est effectué dans cet aperçu.
              </p>
              <dl className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-ink p-4 text-sm">
                <div className="flex justify-between"><dt className="text-white/60">Acheteur</dt><dd className="text-white">{form.firstName} {form.lastName}</dd></div>
                <div className="flex justify-between"><dt className="text-white/60">Articles</dt><dd className="text-white">{count}</dd></div>
                <div className="flex justify-between"><dt className="text-white/60">Remise</dt><dd className="text-white">{DELIVERY_OPTIONS.find((d) => d.key === delivery)?.label}</dd></div>
                {donation > 0 && <div className="flex justify-between"><dt className="text-white/60">Dont don</dt><dd className="text-white">{formatPrice(donation)}</dd></div>}
                <div className="flex justify-between border-t border-white/10 pt-2"><dt className="text-white/60">Montant</dt><dd className="font-semibold text-white">{formatPrice(total)}</dd></div>
              </dl>
              <button type="button" onClick={() => setPreview(false)} className="mt-6 w-full rounded-full border border-white/20 py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-white/10">
                Compris
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </Portal>
    </section>
  );
}
