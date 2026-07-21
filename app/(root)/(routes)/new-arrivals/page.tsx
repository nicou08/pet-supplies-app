import { getNewArrivalProducts } from "@/lib/queries/new-arrival-products";
import { NewArrivalsHero } from "./components/NewArrivalsHero";
import { NewArrivalsGrid } from "./components/NewArrivalsGrid";

export const metadata = { title: "New Arrivals" };

export default async function NewArrivalsPage() {
  const products = await getNewArrivalProducts();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <NewArrivalsHero />
      <div className="h-8" />
      <NewArrivalsGrid products={products} />
    </div>
  );
}
