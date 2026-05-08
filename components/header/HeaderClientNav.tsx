"use client";

import dynamic from "next/dynamic";

export const HeaderNavHamburg = dynamic(
  () => import("./HeaderNavHamburg").then((m) => ({ default: m.HeaderNavHamburg })),
  {
    ssr: false,
    loading: () => (
      <div className="sm:hidden flex items-center px-3">
        <div className="w-11 h-11 rounded-full" />
      </div>
    ),
  }
);

export const MainNavigationMenu = dynamic(
  () => import("./MainNavigationMenu").then((m) => ({ default: m.MainNavigationMenu })),
  {
    ssr: false,
    loading: () => <div className="h-9" />,
  }
);
