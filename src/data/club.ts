import type { ClubInfo } from "@/types";

export const club: ClubInfo = {
  name: "Volley Club Marseillanais",
  shortName: "VCM",
  tagline: "Joue. Smash. Gagne.",
  description:
    "Club convivial au bord de l'étang de Thau, le Volley Club Marseillanais fait vivre le volley pour tous les âges, du Baby Volley dès 3 ans à la compétition, en passant par le loisir et le sport santé.",
  address: {
    venue: "Gymnase Louis Boudou",
    street: "Avenue de Florensac",
    city: "Marseillan",
    postalCode: "34340",
  },
  contact: {
    person: "Delphine Mary",
    phone: "06 81 82 26 60",
    email: "volleymarseillan@gmail.com",
  },
  schedule: "Entraînements les lundis et mercredis",
  // No logo file ships with the repo. Empty means "use the gradient badge" —
  // pointing at a missing file made every device 404 and paint the alt text.
  // Upload a real logo from /admin and it lands in the public blob store.
  logo: "",
  socials: {
    facebook: "https://www.facebook.com/volleyclub.marseillanais/",
    instagram: "https://www.instagram.com/volleyclubmarseillanais/", // [À CONFIRMER]
    website: "https://www.volleymarseillan.com/",
    clubeo: "https://vcm-volley-club-marseillanais.clubeo.com/",
  },
};
