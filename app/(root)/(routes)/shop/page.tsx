import { Suspense } from "react";

import { ShopContent } from "./components/ShopContent";

import Loading from "./loading";
import { FilterSideBar } from "./components/FilterSideBar";
import { ProductList } from "./components/ProductList";

export default function ShopPage() {
  // read docs
  // useSearchParams for URL query string parameters

  return (
    <div className="container mx-auto py-8 px-6 min-h-[calc(100%-136px)]">
      <ShopContent />
    </div>
  );
}
