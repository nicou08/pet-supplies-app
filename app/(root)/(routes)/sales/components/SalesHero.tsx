import { Tag } from "lucide-react";

/**
 * Static red/yellow sales banner. On-brand continuation of the promo-row
 * `SalesButton` the user clicks to reach this page (same palette + `Tag` icon),
 * so the click → land transition feels continuous. Server component — no state.
 */
export function SalesHero() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-red-600 px-6 py-10 text-white shadow-md md:px-10 md:py-14">
      {/* Oversized, low-opacity icon bleeding off the right edge for depth. */}
      <Tag
        className="absolute -right-6 -top-4 h-40 w-40 rotate-12 text-yellow-300/20 md:h-56 md:w-56"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="relative">
        <h1 className="text-4xl font-extrabold tracking-tight text-yellow-300 md:text-6xl">
          UP TO 50% OFF
        </h1>
        <p className="mt-1 text-lg font-bold uppercase tracking-wide text-yellow-300/90 md:text-2xl">
          Deals &amp; Sales
        </p>
        <p className="mt-3 max-w-xl font-medium text-yellow-100">
          Every active deal in one place — while stocks last.
        </p>
      </div>
    </div>
  );
}
