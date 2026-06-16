import { headers } from "next/headers";

import { auth } from "@/auth";
import { getFeaturedProducts } from "@/lib/queries/featured-products";
import { SWRProvider } from "@/components/swr-provider";
import { HomeCarousel } from "@/components/home-carousel";
import { ProductRow } from "@/components/product-row";
import { FavouritesRow } from "@/components/favourites-row";
import { InteractiveRow } from "@/components/interactive-row";
import { PetRow } from "@/components/pets-row";
import { AppointmentRow } from "@/components/appointment-row";
import { PromoRow } from "@/components/promo-row";
import { AccordionInfo } from "@/components/accordion-info";

export default async function HomePage() {
  const [featuredProducts, session] = await Promise.all([
    getFeaturedProducts(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  return (
    <SWRProvider fallback={{ "/api/products?isFeatured=true": featuredProducts }}>
      <div className="overflow-y-auto">
        <div className="h-10" />

        <div className="w-full flex justify-center">
          <HomeCarousel />
        </div>

        <div className="h-10" />

        <InteractiveRow isSignedIn={!!session} />

        <div className="h-10" />

        <ProductRow />

        {session && (
          <>
            <div className="h-10" />
            <FavouritesRow />
          </>
        )}

        <div className="h-10" />

        <PetRow />

        <div className="h-14" />

        <AppointmentRow />

        <div className="h-14" />

        <PromoRow />

        <div className="h-14" />

        <AccordionInfo />

        {/* Placeholder for additional content */}
        <div className="h-[1000px]"></div>
      </div>
    </SWRProvider>
  );
}
