import { CartProvider } from "@/components/shop/CartContext";
import { CartButton, CartDrawer, FlyLayer } from "@/components/shop/CartUI";

/**
 * Habillage commun des pages boutique : le panier (état + bouton flottant +
 * tiroir) n'existe que sous /boutique, le reste du site n'est pas touché.
 */
export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartButton />
      <CartDrawer />
      <FlyLayer />
    </CartProvider>
  );
}
