import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductView from "./ProductView";
import { findProduct } from "@/data/shop";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  return {
    title: product ? `${product.name} · Boutique` : "Boutique",
    description: product?.description,
    robots: { index: false, follow: true },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!findProduct(slug)) notFound();
  return <ProductView slug={slug} />;
}
