import { ShopContent } from "./components/ShopContent";

export default function ShopPage() {
  // read docs
  // useSearchParams for URL query string parameters

  // Old className: className="container mx-auto py-8 px-6 min-h-[calc(100%-136px)]
  // min-h-[calc(100%-145px)]
  return (
    <div className="min-h-[calc(100%-145px)] flex-1">
      <ShopContent />
    </div>
  );
}
