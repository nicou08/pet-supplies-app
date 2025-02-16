import { Suspense } from "react";

import { ShopContent } from "./components/ShopContent";

export default function ShopPage() {
  // read docs
  // useSearchParams for URL query string parameters

  // Old className: className="container mx-auto py-8 px-6 min-h-[calc(100%-136px)]
  return (
    <div className="container mx-auto p-0 min-h-[calc(100%-136px)] ">
      <ShopContent />
    </div>
  );
}
