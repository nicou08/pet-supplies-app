import { getSaleProducts } from "@/lib/queries/sale-products";
import { SalesHero } from "./components/SalesHero";
import { SalesGrid } from "./components/SalesGrid";

export const metadata = { title: "Sales & Deals" };

export default async function SalesPage() {
  const products = await getSaleProducts();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <SalesHero />
      <div className="h-8" />
      <SalesGrid products={products} />
    </div>
  );
}
