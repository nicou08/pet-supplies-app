import { Suspense } from "react";

import Loading from "./loading";
import { FilterSideBar } from "./components/FilterSiderBar";
import { ProductList } from "./components/ProductList";

export default function ShopPage() {
  // read docs
  // useSearchParams for URL query string parameters

  return (
    <div className="container mx-auto py-8 px-6 min-h-[calc(100%-136px)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FilterSideBar />
        <Suspense fallback={<Loading />}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
}
