import { Sparkles } from "lucide-react";

/**
 * Static "just arrived" banner. Structural sibling of `SalesHero` (rounded panel,
 * oversized low-opacity icon bleeding off the right edge) but on a fresh
 * emerald/teal palette + `Sparkles` icon, so the new-arrivals and sales pages read
 * as related-but-distinct. Server component — no state.
 */
export function NewArrivalsHero() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-emerald-600 px-6 py-10 text-white shadow-md md:px-10 md:py-14">
      {/* Oversized, low-opacity icon bleeding off the right edge for depth. */}
      <Sparkles
        className="absolute -right-6 -top-4 h-40 w-40 rotate-12 text-white/15 md:h-56 md:w-56"
        strokeWidth={1.5}
        aria-hidden
      />
      <div className="relative">
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
          JUST ARRIVED
        </h1>
        <p className="mt-1 text-lg font-bold uppercase tracking-wide text-emerald-50/90 md:text-2xl">
          New Arrivals
        </p>
        <p className="mt-3 max-w-xl font-medium text-emerald-50">
          The latest additions to the shop — fresh off the shelf.
        </p>
      </div>
    </div>
  );
}
